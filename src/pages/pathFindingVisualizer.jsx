import React, { Component } from 'react';
import Node from '../components/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithm/dijkstra';
import { bellmanFord } from '../algorithm/bellmanford';

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
      selectedAlgorithm: "dijkstra", // default selection
      executionTime: 0, // store algo execution time
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

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

  animatePathfinding(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    let finalTime = 0;
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 20 * i);
      finalTime = i;
    }
    setTimeout(() => {
      this.setState({ showCost: true });
    }, 20 * finalTime + 500);
  }

  visualizeAlgorithm() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol, selectedAlgorithm } = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];

    let visitedNodesInOrder = [];
    let nodesInShortestPathOrder = [];

    const t0 = performance.now(); // start timer

    if (selectedAlgorithm === "dijkstra") {
      visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    } else if (selectedAlgorithm === "bellman-ford") {
      visitedNodesInOrder = bellmanFord(grid, startNode, finishNode);
      nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    }

    const t1 = performance.now(); // end timer
    const execTime = (t1 - t0).toFixed(2);

    this.setState({ cost: nodesInShortestPathOrder.length, executionTime: execTime });
    this.animatePathfinding(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  getInitialGrid() {
    const { startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } = this.state;
    const grid = [];
    for (let row = 0; row < 15; row++) {
      const currentRow = [];
      for (let col = 0; col < 40; col++) {
        currentRow.push(
          this.createNode(col, row, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol)
        );
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
    };
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  handleStartEndChanges() {
    this.componentDidMount();
  }

  render() {
    const { grid, mouseIsPressed, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol, showCost, cost, selectedAlgorithm, executionTime } = this.state;

    return (
      <div className=' bg-gray-900 text-gray-200 font-mono'>
        <div className=' px-16 py-2'>
          {/* Start/Finish Input Controls */}
          <div className=' p-5 flex justify-between'>
            <div>
              <label>Start Node Row: </label>
              <input
                className=' bg-slate-800 text-gray-200 px-2 py-1 rounded-md'
                type="number"
                value={startNodeRow}
                onChange={(e) => this.setState({ startNodeRow: Math.max(0, Math.min(14, parseInt(e.target.value))) })}
              />
            </div>
            <div>
              <label>Start Node Col: </label>
              <input
                className=' bg-slate-800 text-gray-200 px-2 py-1 rounded-md'
                type="number"
                value={startNodeCol}
                onChange={(e) => this.setState({ startNodeCol: Math.max(0, Math.min(39, parseInt(e.target.value))) })}
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
                onChange={(e) => this.setState({ finishNodeRow: Math.max(0, Math.min(14, parseInt(e.target.value))) })}
              />
            </div>
            <div>
              <label>Finish Node Col: </label>
              <input
                className=' bg-slate-800 text-gray-200 px-2 py-1 rounded-md'
                type="number"
                value={finishNodeCol}
                onChange={(e) => this.setState({ finishNodeCol: Math.max(0, Math.min(39, parseInt(e.target.value))) })}
              />
            </div>
          </div>

          {/* Dropdown to choose algorithm */}
          <div className=' px-5 mb-10 text-center'>
            <label className="mr-3">Select Algorithm: </label>
            <select
              className=' bg-slate-800 text-gray-200 px-3 py-2 rounded-md'
              value={selectedAlgorithm}
              onChange={(e) => this.setState({ selectedAlgorithm: e.target.value })}
            >
              <option value="dijkstra">Dijkstra</option>
              <option value="bellman-ford">Bellman-Ford</option>
            </select>
            <button
              className=' ml-10 py-2 px-6 text-xl rounded-md bg-slate-800 text-gray-200'
              onClick={() => this.handleStartEndChanges()}
            >
              Apply
            </button>
          </div>
        </div>

        <div className=' text-center'>
          <p className=' italic text-sm'>Click and drag to create walls.</p>
        </div>

        {/* Grid Rendering */}
        <div className=' px-20 text-center'>
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
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
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Results Section */}
        <div className=' text-gray-200 text-xl text-center pt-8 max-w-lg mx-auto'>
          {showCost && (
            cost > 1 ? (
              <p>
                The cost of the shortest path is {this.state.cost}.{' '}
                <span className=' text-xs italic'>
                  Considering each node's weight to be 1
                </span>
                <br />
                Execution Time: {executionTime} ms
              </p>
            ) : (
              <p>There doesn't exist any path.</p>
            )
          )}
        </div>

        {/* Visualization Button */}
        <div className=' text-center py-8'>
          <button
            className=' px-10 py-5 bg-teal-600 rounded-md'
            onClick={() => this.visualizeAlgorithm()}
          >
            Visualize {selectedAlgorithm === "dijkstra" ? "Dijkstra's Algorithm" : "Bellman-Ford Algorithm"}
          </button>
        </div>
      </div>
    );
  }
}