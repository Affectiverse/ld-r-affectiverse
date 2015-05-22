import React from 'react';
import DatasetStore from '../stores/DatasetStore';
import {enableAuthentication} from '../configs/reactor';
import {connectToStores} from 'fluxible/addons';
import {NavLink} from 'fluxible-router';

class Dataset extends React.Component {
    includesProperty(list, resource) {
        return false;
    }
    checkAccess(user, graph, resource) {
        if(enableAuthentication) {
            if(user){
                if(parseInt(user.isSuperUser)){
                    return {access: true, type: 'full'};
                }else{
                    if(graph && user.editorOfGraph.indexOf(graph) !==-1){
                        return {access: true, type: 'full'};
                    }else{
                        if(resource && user.editorOfResource.indexOf(resource) !==-1){
                            return {access: true, type: 'full'};
                        }else{
                            if(resource && this.includesProperty(user.editorOfProperty, resource)){
                                return {access: true, type: 'partial'};
                            }else{
                                return {access: false};
                            }
                        }
                    }
                }
            }else{
                return {access: false};
            }
        }else{
            return {access: true, type: 'full'};
        }
    }
    render() {
        let self = this;
        let user = this.context.getUser();
        let graphName = this.props.DatasetStore.graphName;
        let userAccess, title, list, dbClass = 'yellow fork icon';
        if(!this.props.DatasetStore.resources.length){
            list = <div className="ui warning message"><div className="header"> There was no resource in the selected dataset! Either add resources to your dataset or go to another dataset which has resources...</div></div>;
        }else{
            list = this.props.DatasetStore.resources.map((node, index) => {
                title = node.title ? node.title : (node.label? node.label : node.v);
                if(!enableAuthentication) {
                    dbClass = 'green fork icon';
                }else{
                    userAccess = self.checkAccess(user, node.g, node.v);
                    if(userAccess.access){
                        if(userAccess.type === 'full'){
                            dbClass = 'green fork icon';
                        }else{
                            dbClass = 'orange fork icon';
                        }
                    }else{
                        dbClass = 'yellow fork icon';
                    }
                }
                return (
                    <div className="item animated fadeIn" key={index}>
                        <NavLink routeName="resource" className="ui" href={'/dataset/'+ encodeURIComponent(node.g) +'/resource/' + encodeURIComponent(node.v)} >
                            <div className="content"> <i className={dbClass}></i> {title} </div>
                        </NavLink>
                    </div>
                );
            });
        }
        return (
            <div className="ui page grid" ref="dataset">
                <div className="ui column">
                    <div className="ui segment">
                        <h3> Resources of type "{this.props.DatasetStore.resourceFocusType? this.props.DatasetStore.resourceFocusType.join(): 'everything!'}"</h3>
                        <div className="ui big divided animated list">
                            {list}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
Dataset.contextTypes = {
    getUser: React.PropTypes.func
};
Dataset = connectToStores(Dataset, [DatasetStore], function (stores, props) {
    return {
        DatasetStore: stores.DatasetStore.getState()
    };
});
export default Dataset;
