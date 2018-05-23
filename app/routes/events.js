import Collection from './collection';

export default Collection.extend({

  filters: {
    q: 'text',
    upcoming: 'upcoming'
  },

  queryParams: {
    sort: {
      refreshModel: true
    },
    q: {
      refreshModel: true
    },
    upcoming: {
      refreshModel: true
    }
  },

  actions: {
    filterUpcoming(upcoming) {
      this.controller.set('upcoming', upcoming ? true : null);
    },
    createEvent(attributes) {
      let event = this.store.createRecord('event', attributes);
      return event.save().then(() => {
        this.transitionTo('event', event);
      });
    }
  }
});
