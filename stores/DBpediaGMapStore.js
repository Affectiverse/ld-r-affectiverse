import {BaseStore} from 'fluxible/addons';

class DBpediaGMapStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.coordinates = [];
    }
    handleCoordinates(payload) {
        this.coordinates = payload.coordinates;
        this.emitChange();
    }
    getState() {
        return {
            coordinates: this.coordinates
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.coordinates = state.coordinates;
    }
}

DBpediaGMapStore.storeName = 'DBpediaGMapStore'; // PR open in dispatchr to remove this need
DBpediaGMapStore.handlers = {
    'FIND_COORDINATES_SUCCESS': 'handleCoordinates'
};

export default DBpediaGMapStore;