# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 📦 Installation & Setup

Clone the repo and install dependencies:

```bash
https://github.com/Nitinjain14/Pathfindr
npm install
npm start
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## 🧮 Algorithms Implemented

### 1. Dijkstra’s Algorithm
- ✅ Works with non-negative weights
- ✅ Greedy algorithm: always picks the closest unvisited node
- ⏱ Time Complexity: O(E log V) with a binary heap
- 🏆 Best when: Graph has non-negative edges and you want guaranteed optimal shortest path

### 2. Bellman-Ford Algorithm
- ✅ Works with negative weights (but not negative cycles)
- ✅ Iteratively relaxes all edges up to V-1 times
- ⏱ Time Complexity: O(V·E) (slower than Dijkstra)
- 🏆 Best when: Graph may have negative weights (e.g., financial models, currency exchange rates)

### 3. A* Search (A-Star)
- ✅ Uses a heuristic (Manhattan distance here) to guide the search
- ✅ Much faster in practice since it explores fewer nodes
- ⏱ Time Complexity: O(E) in the best case, worst case same as Dijkstra (O(E log V))
- 🏆 Best when: You have a grid or spatial map (like games, maps) and a good heuristic

---

## ⚖️ Comparison Table

| Algorithm       | Handles Negative Weights | Time Complexity               | Use Case                                |
|-----------------|------------------------|-------------------------------|----------------------------------------|
| Dijkstra        | ❌ No                  | O(E log V)                     | General graphs with non-negative edges |
| Bellman-Ford    | ✅ Yes                 | O(V·E)                         | Graphs with negative edge weights      |
| A*              | ❌ No (with default heuristic) | O(E) best, O(E log V) worst | Grids, maps, pathfinding with heuristics |
