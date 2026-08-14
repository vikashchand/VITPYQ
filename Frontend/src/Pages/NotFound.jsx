
import React from "react"; import {Link} from "react-router-dom";
const NotFound=()=> <main className="page-shell" style={{minHeight:"75vh",display:"grid",placeItems:"center",textAlign:"center"}}><div><span className="eyebrow">404 · OFF THE MAP</span><h1 className="page-heading" style={{margin:"20px auto"}}>This page isn't in the vault.</h1><p className="page-subtitle" style={{margin:"0 auto 25px"}}>The link may be old, incomplete or simply never existed.</p><Link className="hero-primary" to="/">Return to the archive →</Link></div></main>;
export default NotFound;
