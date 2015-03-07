'use strict';

angular.module('facetedviz')
  .factory('Fields', function(_, Dataset, vr){

    var Fields = {
      fields: {},
      highlighted: {},
      selected: [],
      selectedKey: null
    };

    function resetField(field) {
      field.selected = undefined;
      delete field._raw;
      delete field._aggr;
      delete field._fn;
    }

    Fields.updateSchema = function(dataschema) {
      Fields.fields = _(dataschema).reduce(function(d, field){
        resetField(field);
        d[field.name] = field;
        return d;
      }, {});
      Fields.highlighted = {};
    };

    Fields.update = function() {
      Fields.selected = Fields.getList()
        .filter(function(d) { return d.selected; });
      Fields.selectedPKey = vr.gen.projections.key(Fields.selected);
    };

    Fields.reset = function() {
      _.each(Fields.fields, resetField);
    };

    Fields.getList = function() {
      return _.values(Fields.fields);
    };

    Fields.setSelected = function(fieldName, val) {
      (Fields.fields[fieldName] || {}).selected = val;
    };

    Fields.toggleSelected = function(fieldName) {
      var field = Fields.fields[fieldName] || {};
      field.selected = field.selected ? undefined : true;
    };

    Fields.isSelected = function(fieldName) {
      return (Fields.fields[fieldName] || {}).selected;
    };

    Fields.setHighlight = function(fieldName, val) {
      Fields.highlighted[fieldName] = val;
    };

    // [{"name":"Cost__Total_$","type":"Q","_aggr":"*","_bin":"*"}]
    return Fields;
  });
