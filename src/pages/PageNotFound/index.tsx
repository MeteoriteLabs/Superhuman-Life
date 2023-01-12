import { useEffect, useState } from "react";
import "./style.scss";

function PageNotFound() {
  const [todos, setTodos] = useState<number[]>([]);

  useEffect(() => {
    for (let i = 0; i < 100; i++) {
      setTodos((todos) => [...todos, i]);
    }
  }, []);

  return (
    <div className="wrapper">
      <div className="text_group">
        <p className="text_404">404</p>
        <p className="text_lost">
          The page you are looking for <br />
          has been lost in space.
        </p>
      </div>
      <div className="window_group">
        <div className="window_404">
          <div className="stars">
            {todos.length
              ? todos.map(() => <div className="star"></div>)
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
