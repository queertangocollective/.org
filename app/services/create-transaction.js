import Service, { inject as service } from '@ember/service';
import method from 'ember-service-methods/inject';

export default Service.extend({

  store: service(),

  uploadPhoto: method(),

  execute(attributes) {
    let transaction = this.store.createRecord('transaction', attributes);
    return transaction.save().then((transaction) => {
      if (attributes.receipt) {
        return this.uploadPhoto(attributes.receipt).then((photo) => {
          transaction.set('receipt', photo);
          return transaction.save();
        });
      }
      return transaction;
    });
  }
});
