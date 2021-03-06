import Service, { inject as service } from '@ember/service';
import RSVP from 'rsvp';
import fetch from 'fetch';
import config from '../config/environment';

function getDimensions(src) {
  return new RSVP.Promise(function (resolve) {
    let img = new Image();
    img.onload = function () {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.src = src;
  });
}

export default Service.extend({
  store: service(),

  execute(file, options={}) {
    let photo = this.store.createRecord('photo', Object.assign({
      filesize: file.get('size'),
      filename: file.get('name'),
      file
    }, options));

    return RSVP.all([
      file.readAsDataURL().then(function (url) {
        photo.set('url', url);
        return getDimensions(url);
      }),
      fetch(config.API_HOST + '/s3-direct', {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Access-Token': localStorage.getItem('qtc-token'),
          'Api-Key': config.API_KEY,
          'Content-Type': 'application/vnd.api+json'
        }
      }).then(function (response) {
        return response.json();
      }).then(function ({ url, credentials }) {
        return file.upload(url, {
          data: credentials
        });
      })
    ]).then(function ([{ width, height }, response]) {
      photo.setProperties({
        width,
        height,
        file: null,
        url: response.headers.location || response.headers.Location
      });
      return photo.save();
    });
  }
});
