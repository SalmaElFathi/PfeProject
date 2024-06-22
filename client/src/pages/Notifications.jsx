import React from "react";
import { Link } from "react-router-dom";
import { useDataContext } from '../contexts/index';

function Notifications() {

    const { notifications } = useDataContext();


    return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', justifyContent: 'start', alignItems: 'center', textAlign: 'start', backgroundColor: 'gray', overflow: 'auto' }}>
            {notifications &&
                notifications.map((element) => {
                    return (
                        <div className="container border allJobs banner card" style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                            <div className="align-items-start">
                                <h2>{element.title}</h2>
                                <h3>{element.subIndustry}</h3>
                            </div>
                            <div style={{ height: '5.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Link to={`/job/${element._id}`}>Job Details</Link></div>
                        </div>
                    );
                })}
        </div>
    );
}

export default Notifications;
