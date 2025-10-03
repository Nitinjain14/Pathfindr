// src/algorithm/aStar.js
// A* algorithm for a grid with 4-neighbors, uniform edge weight = 1.
// Returns visited nodes in the order they were popped (for visualization).
// Also sets .previousNode on nodes so getNodesInShortestPathOrder can work.

export function aStar(grid, startNode, finishNode) {
  // helper: Manhattan distance
  function heuristic(nodeA, nodeB) {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
  }

  // Initialize nodes (we assume caller may have set distance/prev before, but ensure)
  for (const row of grid) {
    for (const node of row) {
      node.g = Infinity; // cost from start to node
      node.f = Infinity; // g + h
      node.previousNode = null;
      node.isVisited = false;
    }
  }

  startNode.g = 0;
  startNode.f = heuristic(startNode, finishNode);

  const openSet = [startNode];
  const visitedNodesInOrder = [];

  while (openSet.length > 0) {
    // sort by f-score, tie-breaker by lower g (prefer closer actual cost)
    openSet.sort((a, b) => {
      if (a.f === b.f) return a.g - b.g;
      return a.f - b.f;
    });

    const current = openSet.shift();

    // If it's a wall, skip it.
    if (current.isWall) continue;

    // Mark as visited (for visualization)
    if (!current.isVisited) {
      current.isVisited = true;
      visitedNodesInOrder.push(current);
    }

    // If we reached finish, stop
    if (current === finishNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;

      const tentativeG = current.g + 1; // uniform cost

      if (tentativeG < neighbor.g) {
        neighbor.previousNode = current;
        neighbor.g = tentativeG;
        neighbor.f = tentativeG + heuristic(neighbor, finishNode);

        // If neighbor not in openSet, add it
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  // If openSet exhausted and finish not reached, return visited nodes
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