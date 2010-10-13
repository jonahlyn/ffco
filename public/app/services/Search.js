require.def(function() {
  var Service = {
    name : '',
    fields : [ 'title', 'abstract', 'url' ],
    baseUrl : 'http://query.yahooapis.com/v1/public/yql?callback=?', 
    cache : {},

    fetch : function(term, cb) {
      var self = this;

      this.term = term;

      if (this.cache[term]) {
        this._handleResponse(term);
      } else {
        $.getJSON(
          this.baseUrl, 
          { q : this._buildQuery(term), format : 'json' }, 
          function(resp) {
            $.proxy(self, '_handleResponse')(resp);
            cb && $.isFunction(cb) && cb({
              results : resp.query.results.result, 
              svc : self.name
            });
          }
        ); 
      }
    },

    _buildQuery : function(term) {
      return 'select ' + this.fields.join(',') + ' from ' + this.name + ' where query="' + term + '"';
    },

    _handleResponse : function(resp) {
      if (!resp.query.results.result) { 
        return; 
      }

      this.cache[this.term] = this.cache[this.term] || resp;
    }
  };

  return function(config) {
    var s = Object.create(Service);
    s.name = config.name;
    if (config.fields) { s.fields = config.fields; }
    return s;
  };
});
