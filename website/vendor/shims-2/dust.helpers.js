(function(_, dust, window, undefined){
  
  _.extend(dust.helpers, {
    iterNum: function(chk, ctx, bodies, params) {
      params = params || {};
      for(var key in params){
          params[key] = dust.helpers.tap(params[key], chk, ctx);
      }

      var fin = ctx.current();
      var x = params.start || 0;
      while(x <= fin) {
        chk.render(bodies.block, ctx.push({
          iterNum: arguments.callee,
          params: params,
          value: x
        }));
        x++;
      }
      return chk;
    },
    iter: function(chk, ctx, bodies, params) {
      var keys = [], obj = ctx.current();        
      
      params = params || {};
      for(var key in params){
          params[key] = dust.helpers.tap(params[key], chk, ctx);
      }

      for (var k in obj) {
          if(obj.hasOwnProperty(k)) keys.push(k);
      }
      if(params.sort){
          var by = params.by || 'name';
          keys = keys.sort(function(ka, kb) {
          var a = new String(obj[ka][by]).toLowerCase(), 
              b = new String(obj[kb][by]).toLowerCase();
          if(a > b) return 1;
          if(a < b) return -1;
          return 0;
        })
      }
      var l = keys.length;
      for (var k in keys) {
          var key = keys[k];
          chk = chk.render(bodies.block, ctx.push({
              iter: arguments.callee,
              key: key,
              value: obj[key],
              index: k,
              length: l,
              params: params
          }));
      }
      return chk;
    },
    dynKey: function(chunk, context, bodies, params) {
      params = params || {};
      if(!params.obj || !params.key) return '';
  
      for(var key in params){
        params[key] = dust.helpers.tap(params[key], chunk, context);
      }

      var value = params.obj[params.key];
      if(_.isFunction(value)) value = value();
      return chunk.write( value || '');
    },    
    dynEq: function(chunk, context, bodies, params) {
      params = params || {};
      if(!params.obj || !params.key || !params.value) return '';
  
      for(var key in params){
          params[key] = dust.helpers.tap(params[key], chunk, context);
      }

      var value = params.obj[params.key];
      if(_.isFunction(value)) value = value();

      if(value && value.toString() == params.value.toString())
        chunk.render(bodies.block, context);
      else if(bodies['else'])
        chunk.render(bodies['else'], context);
      return chunk;
    },
    inArray: function(chunk, context, bodies, params){
      params = params || {};
  
      for(var key in params){
        params[key] = dust.helpers.tap(params[key], chunk, context);
      }

      var value = params.value, array = params.array.split(',');
      var main = bodies.block, other = bodies['else'];
      if(params.reverse){ 
        other = bodies.block;
        main = bodies['else'];
      }
          
      if(_.contains(array, value) && main)
        chunk.render(main, context);
      else if(other) chunk.render(other, context);

      return chunk;
    }
  });
  _.extend(dust.filters, {
    d: function (value) {
      value = value.split('-').join('/');
      return new Date(value);
    },
    dl: function (value) {
      value = value.split('-').join('/');
      return new Date(value).toLocaleString();
    },    
    de: function(value) {
     value = value.split('-').join('/');
      var d = new Date(value);
      return d.toString('ddd, dd MMM yy (h:mm tt)');
    },
    duk: function (value) {
      value = value.split('-').join('/');
      var d = new Date(value);
      return d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
    },
    dus: function (value) {
      value = value.split('-').join('/');
      var d = new Date(value);
      return (d.getMonth() + 1) + '-' + d.getDate() + '-' + d.getFullYear();
    },
    dukp: function(value){    
      value = value.split('-').join('/');      
      var d = new Date(value);
      return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    },
    dusp: function (value) {
      value = value.split('-').join('/');
      var d = new Date(value);
      return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    },
    ucf: function(value){
      if(value == '' || typeof value != 'string') return value;
      return value.charAt(0).toUpperCase() + value.substr(1); 
    },
    uc: function(value){
      if(value == '' || typeof value != 'string') return value;
      return value.toUpperCase();
    },
    lc: function(value){
      if(value == '' || typeof value != 'string') return value;
      return value.toLowerCase();
    },
    ns: function(value){
      if(value == '' || typeof value != 'string') return value;
      return value.replace(/\s+/g, '');
    },
    fcc: function(value) {
      if(value == '' || typeof value != 'string') return value;
      return value.fromCamelCase(true);
    },
    tcc: function(value){
      if(value == '' || typeof value != 'string') return value;
      return value.toCamelCase();      
    },
    stripEnds: function(value){
      if(value == '' || typeof value != 'string') return value;
      return value.substr(1, Math.max(value.length - 2, 2))
    }, 
    il8n: function(value){
      //TODO: create a fields array in il8n class and return that
      return value;
    },
    tag: function(value) {
      if(!value || typeof value != 'string') return value;
      return value.split(' ').join(',');
    },
    trim: function(value) {
      if(!value || typeof value != 'string') return value;
      return value.trim();
    },
  });
})(_, this.dust, this);
