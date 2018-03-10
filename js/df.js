var t = [
  { data: { id: 'N' } },
  { data: { id: 'A' } },
  { data: { id: 'E' } },
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

var edges = [
  { data: { id: 'NA => C', weight: 1, source: 'N', target: 'C' } },
  { data: { id: 'CF => SNA', weight: 2, source: 'C', target: 'S' } },
  { data: { id: 'CF => SNA', weight: 2, source: 'C', target: 'S' } },
];

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
