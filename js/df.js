var t = [
  { data: { id: 'a' } },
  { data: { id: 'b' } },
  { data: { id: 'c' } },
  { data: { id: 'd' } },
  { data: { id: 'e' } }
];
var l = [
  { data: { id: 'a => e', weight: 1, source: 'a', target: 'e' } },
  { data: { id: 'a => b', weight: 3, source: 'a', target: 'b' } }
];

//document.getElementById("t").innerHTML = t;

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
      edges: l
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
