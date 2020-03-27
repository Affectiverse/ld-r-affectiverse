//important: first value in the array is considered as default value for the property
//this file is visible to the server-side
export default {
    serverPort: [4000],
    sparqlEndpoint: {
        'generic': {
            host: 'localhost', port: 7200, path: '/repositories/test', endpointType: 'graphdb'
        },
        //Note: if graphName is not specified, the identifer used for configuration will be used as graphName
        //Example config for connecting to a Stardog triple store, replace testDB with the name of your DB
        // read more at https://www.stardog.com/docs/#_stardog_resources
        // 'http://localhost:5820/testDB': {
        //     host: 'localhost', port: 5820, path: '/testDB', graphName: 'default', endpointType: 'stardog', useReasoning: 0
        // },
        // //Example for connecting to a Virtuoso triple store
        // 'http://dbpedia.org/sparql': {
        //     host: 'dbpedia.org', port: 80, path: '/sparql', graphName: 'default', endpointType: 'virtuoso'
        // },
        // //Example for connecting to a ClioPatria triple store
        // 'http://localhost:3020/sparql/': {
        //     host: 'localhost', port: 3020, path: '/sparql/', endpointType: 'ClioPatria'
        // },
        // //Example for connecting to a GraphDB triple store
        // 'http://localhost:7200': {
        //     host: 'localhost', port: 7200, path: '/repositories/test', graphName: 'default', endpointType: 'graphdb'
        // },
        'http://51.68.79.244:7200': {
            host: '51.68.79.244', port: 7200, path: '/repositories/test', graphName: 'default', endpointType: 'graphdb'
        },
        // 'http://54.210.58.138:7200/repositories/mhdb': {
        //     host: '54.210.58.138', port: 7200, path: '/repositories/mhdb', endpointType: 'graphdb'
        // },
        // //added a new endpoint
        // 'http://live.dbpedia.org/sparql': {
        //     host: 'live.dbpedia.org', port: 80, path: '/sparql', graphName: 'default', endpointType: 'virtuoso'
        // }
    },
    dbpediaLookupService: [
        { host: 'lookup.dbpedia.org' }
    ],
    dbpediaSpotlightService: [
        { host: 'api.dbpedia-spotlight.org', port: 80, path: '/en/annotate' }
    ],
    //it is used only if you enabled recaptcha feature for user authentication
    //get keys from https://www.google.com/recaptcha
    googleRecaptchaService: {
        siteKey: ['put your google recaptcha site key here...'],
        secretKey: ['put your google recaptcha secret key here...']
    }
};