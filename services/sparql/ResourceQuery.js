'use strict';
import {getQueryDataTypeValue} from '../utils/helpers';
class ResourceQuery{
    constructor() {
        /*jshint multistr: true */
        this.prefixes='\
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> \
        PREFIX dcterms: <http://purl.org/dc/terms/> \
        PREFIX void: <http://rdfs.org/ns/void#> \
        PREFIX foaf: <http://xmlns.com/foaf/0.1/> \
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#> \
         ';
        this.query='';
    }
    getPrefixes() {
        return this.prefixes;
    }
    getProperties(graphName, resourceURI) {
        /*jshint multistr: true */
        this.query = '\
        SELECT ?p ?o (count(?extendedVal) AS ?hasExtendedValue) FROM <'+ graphName +'> WHERE { \
        <'+ resourceURI + '> ?p ?o . \
        OPTIONAL {?o ?uri ?extendedVal .} \
    } GROUP BY ?p ?o ORDER BY ?p ?o';
      return this.query;
    }
    addTriple (graphName, resourceURI, propertyURI, objectValue, valueType, dataType) {
        //todo: consider different value types
      let newValue, tmp = {};
      tmp = getQueryDataTypeValue(valueType, dataType, objectValue);
      newValue = tmp.value;
      /*jshint multistr: true */
      this.query = '\
      INSERT DATA INTO <'+ graphName +'> { \
      <'+ resourceURI + '> <'+ propertyURI +'> '+ newValue +' } ';
      return this.query;
    }
    deleteTriple(graphName, resourceURI, propertyURI, objectValue, valueType, dataType) {
        let dtype, newValue, tmp = {};
        if(objectValue){
            tmp = getQueryDataTypeValue(valueType, dataType, objectValue);
            newValue = tmp.value;
            dtype = tmp.dtype;
          //if we just want to delete a specific value for multi-valued ones
          this.query = 'DELETE FROM <'+ graphName +'> {<'+ resourceURI +'> <'+ propertyURI +'> ?v} WHERE { <'+ resourceURI +'> <'+ propertyURI +'> ?v . FILTER(' + dtype + '(?v)= '+ newValue +' ) }';
        }else{
            this.query = 'DELETE FROM <'+ graphName +'> {<'+ resourceURI +'> <'+ propertyURI +'> ?z } WHERE { <'+ resourceURI +'> <'+ propertyURI +'> ?z } ';
        }
        return this.query;
    }
    deleteTriples(graphName, resourceURI, propertyURI, changes) {
        let self = this;
        self.query= '';
        changes.forEach(function(change) {
            self.query = self.query + self.deleteTriple(graphName, resourceURI, propertyURI, change.oldValue, change.valueType, change.dataType);
        });
        return self.query;
    }
    updateTriple (graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType) {
        this.query = this.deleteTriple(graphName, resourceURI, propertyURI, oldObjectValue, valueType, dataType) + this.addTriple(graphName, resourceURI, propertyURI, newObjectValue, valueType, dataType);
        return this.query;
    }
    updateTriples (graphName, resourceURI, propertyURI, changes) {
        let self = this;
        self.query= '';
        changes.forEach(function(change) {
            self.query = self.query + self.updateTriple(graphName, resourceURI, propertyURI, change.oldValue, change.newValue, change.valueType, change.dataType);
        });
        return self.query;
    }
    updateObjectTriples (graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, valueType, dataType, detailData) {
        let self=this;
        self.query = self.deleteTriple(graphName, resourceURI, propertyURI, oldObjectValue, valueType, dataType) + self.addTriple(graphName, resourceURI, propertyURI, newObjectValue, valueType, dataType) ;
        for (let propURI in detailData) {
            self.query = self.query + self.deleteTriple(graphName, oldObjectValue, propURI, '', detailData[propURI].valueType, detailData[propURI].dataType);
            self.query = self.query + self.addTriple(graphName, newObjectValue, propURI, detailData[propURI].value, detailData[propURI].valueType, detailData[propURI].dataType);
        }
        return self.query;
    }
}
export default ResourceQuery;
