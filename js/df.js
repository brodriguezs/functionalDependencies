var t = [
  { data: { id: 'N' , position: { x: 215, y: 85 }}},
  { data: { id: 'A' , position: { x: 230, y: 20 }}},
  { data: { id: 'E' , position: { x: 215, y: 85 }}},
  { data: { id: 'C' } },
  { data: { id: 'F' } },
  { data: { id: 'I' } },
  { data: { id: 'P' } },
  { data: { id: 'D' } },
  { data: { id: 'T' } },
  { data: { id: 'S' } }
];

var l = [
  {implicante:"NA", implicado:"C"}, // NA => C
  {implicante:"CF", implicado:"SNA"},
  {implicante:"E", implicado:"NA"},
  {implicante:"I", implicado:"D"},
  {implicante:"I", implicado:"NA"},
  {implicante:"C", implicado:"S"},
  {implicante:"C", implicado:"E"},
  {implicante:"NA", implicado:"C"},
  {implicante:"T", implicado:"NA"}
];

var edges = [];

l.map(el => {
  let anteArr = el.implicante.split("");
  let adoArr = el.implicado.split(""); 

  anteArr.map((eachAnte, indexAnte, self) =>{
    adoArr.map((eachAdo, indexAdo, self) =>{
      edges.push({data:{ id: `${eachAdo}=>${eachAdo}*${indexAnte}${indexAdo}`, weight:1, source: `${eachAnte}`, target: `${eachAdo}`}}) 
    }) 
  })
})

console.log("EDGES");
console.log(edges);

//Grapho functionality
var grapho = cytoscape({
  container: document.getElementById('grapho'),

  boxSelectionEnabled: false,
  autounselectify: true,

  style: cytoscape.stylesheet()
    .selector('node')
      .css({
        'content': 'data(id)'
      })
    .selector('edge')
      .css({
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'width': 4,
        'line-color': '#ddd',
        'target-arrow-color': '#ddd'
      })
    .selector('.highlighted')
      .css({
        'background-color': '#61bffc',
        'line-color': '#61bffc',
        'target-arrow-color': '#61bffc',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      }),

  elements: {
      nodes: t,
      edges: edges
    },

  layout: {
    name: 'breadthfirst',
    directed: true,
    roots: '#a',
    padding: 10
  }
});

var bfs = grapho.elements().bfs('#a', function(){}, true);

var i = 0;
var highlightNextEle = function(){
  if( i < bfs.path.length ){
    bfs.path[i].addClass('highlighted');
    i++;
    setTimeout(highlightNextEle, 1000);
  }
};

// kick off first highlight
highlightNextEle();

var app = new Vue({
  el: "#app",
  data : {
    atributes: t,
    dependencies: l
  }
});



// DF lib functions
//
function k_combinations(set, k) {
  var i, j, combs, head, tailcombs;
  if (k > set.length || k <= 0) {
    return [];
  }
  if (k == set.length) {
    return [set];
  }
  if (k == 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }
  // Assert {1 < k < set.length}
  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    head = set.slice(i, i+1);
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}

function combinations(set) {
  var k, i, combs, k_combs;
  combs = [];
  // Calculate all non-empty k-combinations
  for (k = 1; k <= set.length; k++) {
    k_combs = k_combinations(set, k);
    for (i = 0; i < k_combs.length; i++) {
      combs.push(k_combs[i]);
    }
  }
  return combs;
}

var closure_of = function(a_keys, kva_fds){
  var result = [].concat(a_keys);
  var fds = [].concat(kva_fds);
  do{
    var found = false;
    for (var j = 0; j < fds.length; j++) {
      var fd = fds[j];
      var Y = fd[0];
      var Z = fd[1];
      var count = 0;
      for (var i = 0; i < Y.length; i++) {
        if(result.indexOf(Y[i]) > -1)
            count++;
          else
            break;
      }
      if(count == Y.length){
          found=true;
          Z.forEach(function(attr){
            //console.log(result.indexOf(attr));
            if(result.indexOf(attr) == -1)
              result.push(attr);
            //else
              //console.log(attr);
          });
          //result = result.concat(Z);
          fds.splice(j--,1);
          //console.log('found:'  );
          break;
        }
    }
  } while(found==true);
  return result.sort();
}

var fd_closure = function(a_attrs, kva_fds){
  var left_hand_sides = combinations(a_attrs);
  var closure = [];
  left_hand_sides.forEach(function(lhs){
    var closure_of_x = [lhs, closure_of(lhs, kva_fds)];
    closure.push(closure_of_x);
  });
  return closure;
}

/*
From course:
MINIMAL COVERS
Let F 1 and F 2 be two sets of functional dependencies.
If F1 ≡ F2,then we say the F1 is a cover ofF2 and F2 is a cover of
F1.We also say thatF1coversF2and vice versa. It easy to showthat every
set of functional dependencies Fis covered by a set of
functional dependencies G, in which the right hand side of each fd has
only one attribute.We say a set of dependencies F isminimalif:(1) Ev
ery right hand side of each fd in F is a single attribute.(2) The left hand
side of each fd does not have any redundantattribute, i.e., for every fd
X→AinFwhere X is a compos- attribute, and for anyproper subset Z of X, the functional
dependencyZ→A∉F+.(3) Fis reduced (without redundant fd’s). Thismeans that for
ev ery X→AinF,the set F−{X→A} is NOTequivalentto F.
Minimal Covers of F.It is easy to see that for each set F offunctional dependencies,
there exists a set of functional dependen-cies F′such that F≡F′and F′is minimal.
We call such F′amini-mal coverof F
.
*/
var break_rhs = function(kva_fds){
  var new_fds = [];
  kva_fds.forEach(function(fd){
    fd[1].forEach(function(attr){
      new_fds.push([fd[0],[attr]]);
    });
  });
  return new_fds;
}

//
/*
From course:
Eliminate redundancy in the left hand side.The fd CD→A is replaced by C
→A. This is because C→D ∈ (F′)+, hence C→CD ∈ (F′)+; from C→CD ∈(F′)+ and CD→A ∈ F′,
by transitivity, we have C→A∈(F′)+ and hence CD→A should be replaced by C→A. Similarly,
CD→B is replaced by C→B, AE→C is replaced by A→C. F′= {C→A, C→B, C→D, D→E, D→H, A→C, B→D}
after step (2).
*/
var elim_lhs_redundancy = function(a_keys, kva_fds){
  var fm = break_rhs(kva_fds);
  do{
    var contin = false;
    var new_fm = [];
    var fmc = fd_closure(a_keys, fm);
    fm.forEach(function(fd){
      if(fd[0].length > 1){ // it is a composite key
        // CSC 4402 Notes
        // X is a composite attribute and
        // Z ⊂ X is a proper subset of X and Z → A ∈ (F′)+, do replace X → A
        // with Z → A.
        var replaced = false;
        for(i=0;i<fmc.length;++i){
          var is_proper_subset = fd[0].proper_subset(fmc[i][0]);
          //console.log(fd[0] + '->' + fd[1] + ':' + fmc[i][0] + '->' + fmc[i][1]);
          //console.log(is_proper_subset);
          if(is_proper_subset && fmc[i][1].indexOf(fd[1][0]) != -1){
            replaced = true;
            var already_included = false;
            for(j = 0; j < fm.length; ++j)
              if(fm[j].equals([fmc[i][0],fd[1][0]])){
                already_included = true;
                break;
              }
            if(already_included == false)
              new_fm.push([fmc[i][0],fd[1]]);
            break;
          }
        }
        if(replaced == false)
          new_fm.push([fd[0],fd[1]]);
      }else{
        new_fm.push([fd[0],fd[1]]);
      }
    })
    if(fm.equals(new_fm) === false){
      fm = new_fm;
      contin = true;
    }
  }while(contin);
  return fm;
}

var remove_redundant_fds = function(a_keys, kva_fds){
  // F′= {C→A, C→B, C→D, D→E, D→H, A→C, B→D}
  // CSC 4402 Notes
  // The fd C→D is eliminated because it can be derived from C→B and B→D and hence it is
  // redundant. The F′now becomes {C→A, C→B, D→E, D→H, A→C, B→D}, which is the only
  // minimal cover of F.♣
  var fm = elim_lhs_redundancy(a_keys, kva_fds),
      new_fm = [],
      X = [],
      coX = [],
      attrs = []

  fm.forEach(function(fd){
    if(fd[0].equals(X) === false){
      X = fd[0]
      attrs = []
    }
    //console.log(attrs);
    var redundant = false;
    for(i=0;i<attrs.length;++i){
      for(j=0;j<fm.length;++j){
        if(fm[j][0].indexOf(attrs[i]) > -1 && fm[j][1].indexOf(fd[1][0]) > -1)
          redundant = true;
      }
      if(redundant)
        break;
    }
    if(redundant === false){
      new_fm.push([fd[0],fd[1]])
      attrs.push(fd[1][0])
    }
  })

  return new_fm
}

var minimal_cover = function(a_keys, kva_fds){
  return remove_redundant_fds(a_keys, kva_fds)
}

var necessary_keys_of = function(a_keys, kva_fds){
  var necessary_keys = [];
  a_keys.forEach(function(key){
    var in_lhs = false;
    var in_rhs = false;
    kva_fds.forEach(function(fd){
      if(in_lhs === false)
        if(fd[0].indexOf(key) != -1)
          in_lhs = true;
      if(in_rhs === false)
        if(fd[1].indexOf(key) != -1)
          in_rhs = true;
    })
    if(in_lhs && !in_rhs || !in_lhs && !in_rhs)
      necessary_keys.push(key)
  })
  return necessary_keys;
}

var useless_keys_of = function(a_keys, kva_fds){
  var useless_keys = [];
  a_keys.forEach(function(key){
    var in_lhs = false;
    var in_rhs = false;
    kva_fds.forEach(function(fd){
      if(in_lhs === false)
        if(fd[0].indexOf(key) != -1)
          in_lhs = true;
      if(in_rhs === false)
        if(fd[1].indexOf(key) != -1)
          in_rhs = true;
    })
    if(!in_lhs && in_rhs)
      useless_keys.push(key)
  })
  return useless_keys;
}

var middle_ground_keys_of = function(a_keys, kva_fds){
  var middle_ground_keys = [];
  var necessary_keys = necessary_keys_of(a_keys, kva_fds);
  var useless_keys = useless_keys_of(a_keys, kva_fds);
  var middle_ground_test_array = necessary_keys + useless_keys;
  a_keys.forEach(function(key){
    if(middle_ground_test_array.indexOf(key) == -1)
      middle_ground_keys.push(key)
  })
  return middle_ground_keys;
}

var candidate_keys_of = function(a_keys, kva_fds){
  //console.log(possible_keys)
  var candidate_keys = [];
  var necessary_keys = necessary_keys_of(a_keys, kva_fds);
  //console.log(necessary_keys);
  var useless_keys = useless_keys_of(a_keys, kva_fds);
  var middle_ground_keys = middle_ground_keys_of(a_keys, kva_fds);
  var possible_keys = function(){
    var tmp_keys = combinations(middle_ground_keys);
    var possible = [];
    tmp_keys.forEach(function(a_keys){
      possible.push(a_keys.concat(necessary_keys));
    })
    return possible;
  }();
  //console.log(possible_keys);
  while(possible_keys.length > 0){
    var possible_key = possible_keys.shift();
    var possible_key_closure = closure_of(possible_key, kva_fds);
    var tmp_cks = [];
    //console.log(closure_of(possible_key, kva_fds));
    if(possible_key_closure.equals(a_keys)){
      possible_keys.forEach(function(ck){
        if(ck.subset(possible_key) == false)
          tmp_cks.push(ck)
      })
      candidate_keys.push(possible_key)
      possible_keys = tmp_cks
    }
  }
  return candidate_keys;
}

// Some methods extending array funcionalities
//

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.proper_subset = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (array.length >= this.length)
        return false;

    for (var i = 0; i<array.length; ++i) {
      if(this.indexOf(array[i]) == -1) {
        return false;
      }
    }
    return true;
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.subset = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (array.length > this.length)
        return false;

    for (var i = 0; i<array.length; ++i) {
      if(this.indexOf(array[i]) == -1) {
        return false;
      }
    }
    return true;
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.is_subset_of = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length > array.length)
        return false;

    for (var i = 0; i<this.length; ++i) {
      if(array.indexOf(this[i]) == -1) {
        return false;
      }
    }
    return true;
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.includes_fd = function (element) {
    // if the other array is a falsy value, return
    if (!element)
        return false;

    // compare lengths - can save a lot of time
    if (element instanceof Array){
      for (var i = 0; i < this.length; ++i) {
        if(this[i] instanceof Array && this[i][0].equals(element[0]) && element[1].is_subset_of(this[i][1])) {
          return true;
        }
      }
    }
    return false;
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.merge = function (that) {
    var this_index = 0;
    var that_index = 0;
    var this_and_that = [].concat(this);
    that.forEach(function(element){
      if(this_and_that.indexOf(element) == -1)
        this_and_that.push(element)
    })
    //while(this_index < this.length || that_index < that.length){
    //
    //}
    return this_and_that;
}


// Defining dependency elements and exec
//
var T = [];
var L = [];

t.forEach(el =>{
 T.push(el.data.id); 
});

console.log("T Set:");
console.log(T);

l.map(el => {
  let anteArr = el.implicante.split("");
  let adoArr = el.implicado.split(""); 
  let df = [];
  df.push(anteArr,adoArr);
  L.push(df);
})

console.log("L Set:");
console.log(L);

var min_cover = minimal_cover(T,L);
console.log(min_cover);
