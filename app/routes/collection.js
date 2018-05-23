import Route from '@ember/routing/route';
import { get, computed } from '@ember/object';
import Restricted from 'torii/routing/authenticated-route-mixin';
import { singularize } from 'ember-inflector';

export default Route.extend(Restricted, {

  queryParams: {
    sort: {
      refreshModel: true
    },
    q: {
      refreshModel: true
    }
  },

  modelName: computed({
    get() {
      return singularize(this.routeName);
    }
  }),

  query(params) {
    return this.store.query(this.modelName, {
      sort: params.sort,
      page: {
        limit: 50,
        offset: params.offset
      },
      filter: this.filters.reduce((filters, param) => {
        let value = params[param];
        let key = param === 'q' ? 'text' : param;
        if (value !== '' && value != null) {
          filters[key] = value;
        }
        return filters;
      }, {}),
      include: this.include
    }).then(function (results) {
      return {
        model: results,
        meta: get(results, 'meta')
      };
    });
  },

  model(params) {
    return this.query(params);
  },

  actions: {
    accessDenied() {
      this.transitionTo('index');
    },

    load(offset) {
      return this.query({
        offset,
        sort: get(this.controller, 'sort'),
        q: get(this.controller, 'q')
      });
    }
  }
});
