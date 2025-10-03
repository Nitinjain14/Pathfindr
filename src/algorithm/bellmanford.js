// Performs Bellman-Ford algorithm; returns *all* nodes in the order
// in which they were relaxed. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function bellmanFord(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const allNodes = getAllNodes(grid);

  // Step 1: Initialize distances
  for (const node of allNodes) {
    node.distance = Infinity;
    node.previousNode = null;
    node.isVisited = false;
  }
  startNode.distance = 0;

  // Step 2: Relax edges repeatedly (V-1 times)
  const numNodes = allNodes.length;
  for (let i = 0; i < numNodes - 1; i++) {
    let updated = false;

    for (const node of allNodes) {
      if (node.distance === Infinity || node.isWall) continue;
      const neighbors = getNeighbors(node, grid);

      for (const neighbor of neighbors) {
        if (neighbor.isWall) continue;
        const newDist = node.distance + 1; // weight of each edge = 1 (grid)
        if (newDist < neighbor.distance) {
          neighbor.distance = newDist;
          neighbor.previousNode = node;
          updated = true;
        }
      }
    }

    // For visualization: mark nodes relaxed in this iteration
    for (const node of allNodes) {
      if (node.distance !== Infinity && !node.isVisited) {
        node.isVisited = true;
        visitedNodesInOrder.push(node);
      }
    }

    if (!updated) break; // optimization: stop early if no changes
  }

  // Step 3: Optional - check for negative weight cycles (not needed in grid)
  // For completeness:
  for (const node of allNodes) {
    if (node.distance === Infinity || node.isWall) continue;
    const neighbors = getNeighbors(node, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;
      if (node.distance + 1 < neighbor.distance) {
        console.warn("Graph contains a negative weight cycle!");
      }
    }
  }

  return visitedNodesInOrder;
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors;
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* bellmanFord (or dijkstra).
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
