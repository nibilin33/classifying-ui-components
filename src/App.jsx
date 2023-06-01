import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
// import * as p5 from "p5";
// const p5Tool = new p5();
import Trainning from './pages/Trainning'
import Classify from './pages/Classify'

function App() {
  return (
    <>
      <Layout />
      <Routes>
          <Route path="/trainning" element={<Trainning />}>
          </Route>
          <Route path="/classify" element={<Classify />}>
          </Route>
      </Routes>
    </>
  );
}
function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/trainning">trainning</Link>
          </li>
          <li>
            <Link to="/classify">custom classify</Link>
          </li>
          <li>
            <Link to="/detect-object">object detection</Link>
          </li>
        </ul>
      </nav>
      <hr />
    </div>
  )
}

export default App;
