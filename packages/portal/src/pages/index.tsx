import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PageContainer from "../components/page-container";
import Home from "./home";

function Pages() {
  return (
    <PageContainer>
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </Router>
    </PageContainer>
  );
}

export default Pages;
