import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubs } from "../../functions/sub";

const SubList = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubs().then((subs) => {
      setSubs(subs.data);
      setLoading(false);
    });
  }, []);

  const showSubs = () => 
    subs.map((sub) => (
      <div
        key={sub._id}
        className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-2"
      >
        <Link to={`/sub/${sub.slug}`}>
        <img
            src={sub.images[0].url}
            alt="laptop img"
            style={{
              height: "50px",
              objectFit: "cover",
            }}
          />
        </Link>
      </div>
    ));
    

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <h4 className="text-center">Loading...</h4>
        ) : (
          showSubs()
        )}
      </div>
    </div>
  );
};

export default SubList;
