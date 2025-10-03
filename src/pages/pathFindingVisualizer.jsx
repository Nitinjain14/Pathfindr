// PathfindingVisualizer.jsx
import React, { Component } from 'react';
import Node from '../components/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithm/dijkstra';
import { bellmanFord } from '../algorithm/bellmanford';
import { aStar } from '../algorithm/astar';

import './pathFindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNodeRow: 0,
      startNodeCol: 0,
      finishNodeRow: 14,
      finishNodeCol: 39,
      cost: 0,
      showCost: false,
      selectedAlgorithm: 'dijkstra',
      executionTime: 0,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  // --- Mouse handlers ---
  handleMouseDown(row, col) {
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  // --- Animation helpers ---
  animateVisitedNodes(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.className = 'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    let finalTime = 0;
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.className = 'node node-shortest-path';
      }, 20 * i);
      finalTime = i;
    }
    setTimeout(() => {
      this.setState({ showCost: true });
    }, 20 * finalTime + 500);
  }

  // Reset node properties on the grid (returns a fresh-deep-copied grid)
  createFreshGridFrom(grid) {
    const newGrid = [];
    for (let r = 0; r < grid.length; r++) {
      const currentRow = [];
      for (let c = 0; c < grid[0].length; c++) {
        const node = grid[r][c];
        currentRow.push({
          ...node,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
          // Clear any algorithm-specific helper properties (g/f) if present
          g: Infinity,
          f: Infinity,
        });
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  }

  // Main orchestrator: reset grid, run chosen algorithm, measure time, animate
  visualizeAlgorithm() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol, selectedAlgorithm } = this.state;

    // 1) create a fresh grid and update state so Node components reflect fresh state
    const freshGrid = this.createFreshGridFrom(grid);
    this.setState({ grid: freshGrid, showCost: false, cost: 0 }, () => {
      const startNode = freshGrid[startNodeRow][startNodeCol];
      const finishNode = freshGrid[finishNodeRow][finishNodeCol];

      let visitedNodesInOrder = [];
      let nodesInShortestPathOrder = [];

      const t0 = performance.now();

      if (selectedAlgorithm === 'dijkstra') {
        visitedNodesInOrder = dijkstra(freshGrid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      } else if (selectedAlgorithm === 'bellman-ford') {
        visitedNodesInOrder = bellmanFord(freshGrid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      } else if (selectedAlgorithm === 'astar' || selectedAlgorithm === 'a*') {
        visitedNodesInOrder = aStar(freshGrid, startNode, finishNode);
        nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      }

      const t1 = performance.now();
      const execTime = (t1 - t0).toFixed(2);

      // cost: length of path (nodes count) if path exists, otherwise 0
      const pathCost = nodesInShortestPathOrder.length > 0 ? nodesInShortestPathOrder.length : 0;

      this.setState({ cost: pathCost, executionTime: execTime }, () => {
        this.animateVisitedNodes(visitedNodesInOrder, nodesInShortestPathOrder);
      });
    });
  }

  // --- Grid creation / helpers ---
  getInitialGrid() {
    const { startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const grid = [];
    for (let row = 0; row < 15; row++) {
      const currentRow = [];
      for (let col = 0; col < 40; col++) {
        currentRow.push(this.createNode(col, row, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode(col, row, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol) {
    return {
      col,
      row,
      isStart: row === startNodeRow && col === startNodeCol,
      isFinish: row === finishNodeRow && col === finishNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      g: Infinity,
      f: Infinity,
    };
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice().map(r => r.slice()); // shallow copy rows
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  handleStartEndChanges() {
    // re-create initial grid so start/finish nodes update
    const grid = this.getInitialGrid();
    this.setState({ grid, showCost: false, cost: 0, executionTime: 0 });
  }

  // --- Render ---
  render() {
    const { grid, mouseIsPressed, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol, showCost, cost, selectedAlgorithm, executionTime } = this.state;

    return (
      <div className=' bg-gray-900 text-gray-200 font-mono'>
        <div className=' px-16 py-2'>
          <div className=' p-5 flex justify-between'>
            <div>
              <label>Start Node Row: </label>
              <input
                className=' bg-slate-800 text-gray-200 px-2 py-1 rounded-md'
                type="number"
                value={startNodeRow}
                onChange={(e) => {
                  let value = parseInt(e.target.value);
                  if (Number.isNaN(value)) value = 0;
                  const minValue = 0;
                  const maxValue = 14;
                  if (value < minValue) value = minValue;
                  else if (value > maxValue) value = maxValue;
                  this.setState({ startNodeRow: value });
                }}
              />
            </div>
            <div>
              <label>Start Node Col: </label>
              <input
                className=' bg-slate-800 text-gray-200 px-2 py-1 rounded-md'
                type="number"
                value={startNodeCol}
                onChange={(e) => {
                  let value = parseInt(e.target.value);
                  if (Number.isNaN(value)) value = 0;
                  const minValue = 0;
                  const maxValue = 39;
                  if (value < minValue) value = minValue;
                  else if (value > maxValue) value = maxValue;
                  this.setState({ startNodeCol: value });
                }}
              />
            </div>
          </div>

          <div className='p-5 flex justify-between'>
            <div>
              <label>Finish Node Row: </label>
              <input
                className=' bg-slate-800 text-gray-200 px-2 py-1 rounded-md'
                type="number"
                value={finishNodeRow}
                onChange={(e) => {
                  let value = parseInt(e.target.value);
                  if (Number.isNaN(value)) value = 0;
                  const minValue = 0;
                  const maxValue = 14;
                  if (value < minValue) value = minValue;
                  else if (value > maxValue) value = maxValue;
                  this.setState({ finishNodeRow: value });
                }}
              />
            </div>
            <div>
              <label>Finish Node Col: </label>
              <input
                className=' bg-slate-800 text-gray-200 px-2 py-1 rounded-md'
                type="number"
                value={finishNodeCol}
                onChange={(e) => {
                  let value = parseInt(e.target.value);
                  if (Number.isNaN(value)) value = 0;
                  const minValue = 0;
                  const maxValue = 39;
                  if (value < minValue) value = minValue;
                  else if (value > maxValue) value = maxValue;
                  this.setState({ finishNodeCol: value });
                }}
              />
            </div>
          </div>

          <div className=' px-5 mb-10 text-center'>
            <label className="mr-3">Select Algorithm: </label>
            <select
              className=' bg-slate-800 text-gray-200 px-3 py-2 rounded-md'
              value={selectedAlgorithm}
              onChange={(e) => this.setState({ selectedAlgorithm: e.target.value })}
            >
              <option value="dijkstra">Dijkstra</option>
              <option value="bellman-ford">Bellman-Ford</option>
              <option value="astar">A*</option>
            </select>

            <button
              className=' ml-6 py-2 px-6 text-xl rounded-md bg-slate-800 text-gray-200'
              onClick={() => this.handleStartEndChanges()}
            >
              Apply
            </button>
          </div>
        </div>

        <div className=' text-center'>
          <p className=' italic text-sm'>Click and drag to create walls.</p>
        </div>

        <div className=' px-20 text-center'>
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} style={{ height: 20 }}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(r, c) => this.handleMouseDown(r, c)}
                      onMouseEnter={(r, c) => this.handleMouseEnter(r, c)}
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className=' text-gray-200 text-xl text-center pt-8 max-w-lg mx-auto'>
          {showCost && (
            cost > 1 ? (
              <div>
                <p>The cost of the shortest path is {cost}. <span className=' text-xs italic'> Considering each node's weight to be 1</span></p>
                <p className=' text-sm mt-2'>Execution Time: {executionTime} ms ({selectedAlgorithm})</p>
              </div>
            ) : (
              <p>There doesn't exist any path.</p>
            )
          )}
        </div>

        <div className=' text-center py-8'>
          <button
            className=' px-10 py-5 bg-teal-600 rounded-md'
            onClick={() => this.visualizeAlgorithm()}
          >
            Visualize {selectedAlgorithm === 'dijkstra' ? "Dijkstra's Algorithm" : selectedAlgorithm === 'bellman-ford' ? 'Bellman-Ford' : 'A*'}
          </button>
        </div>
      </div>
    );
  }
}