import Component from '@ember/component';

export default Component.extend({
  tagName: ''
}).reopenClass({
  positionalParams: 'params'
})