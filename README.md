# Redux JSON API Module

Redux reducer, actions, action creators, and selectors for interacting with JSON API.

## Install

Add it to your reducers.
```js
// reducer.js

import { combineReducers } from 'redux';
import api from 'redux-json-api-module';

combineReducers({
  // all reducers
  ...
  api,
  ...
})
```

Define your API endpoints with axios middle ware

```js
// middleware.js

import { applyMiddleware } from 'redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

const client = axios.create({
  baseURL: 'https://app.com/api/v1',
  responseType: 'json',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

applyMiddleware(
  //all middlewares
  ...
  axiosMiddleware(client), //second parameter options can optionally contain onSuccess, onError, onComplete, successSuffix, errorSuffix
  ...
)
```

NOTE: If you need to add auth headers or take action on api call request/response checkout 
[redux-axios-middleware interceptors](https://github.com/svrcekmichal/redux-axios-middleware#interceptors)

## Usage

In our container component we call `fetchRecords()` to load the data we need.  Notice we use the returned promise from 
`fetchRecords()` to toggle a loading state.

When `fetchRecords()` returns with an error we record the ids, this is a good idea for performance reasons. Storing the 
returned id's means we don't need to sort and filter the raw store data whenever we make changes.
```js
// RecordList.js

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fetchRecords } from 'redux-json-api-module';

class RecordList extends PureComponent {
  state = {
    ids: [],
    loading: false,
  };
  
  componentWillMount() {
    const { fetchRecords } = this.props;
    
    this.setState({loading: true});
    
    // fetch the 10 most recently updated records with user
    fetchRecords('items', { 
      include: 'user',
      filter: { scope: 'active' },
      sort: '-updated_at',
      page: { size: 10,  }
    }).then((resp) => {
      if (!resp.error) {
        this.setState({ids: resp.payload.data.data.map(r => r.id)})
      }
    }).finally(() => this.setState({loading: false}))
  }
  
  render() {
    const { ids, loading } = this.state;
    
    return (
      loading ? (
        <div className="loader" />
      ) : (
        <ul>
          {ids.map(id => <RecordItem key={id} itemId={id} />)}
        </ul>
      )
    )
  }
}

const mapDispatchToProps = {
  fetchRecords,
};

export default connect(null, mapDispatchToProps)(RecordList)
```

In our child component we use `getRecord()` and `getRelationship()` to load the item and related user records.  Then, we 
pass in only the attributes we need.  Passing only needed attributes keeps the mapStateToProps flat and simple, reducing 
needless rendering
```js
// RecordList.js

import React from 'react';
import { connect } from 'react-redux';
import { getRecord } from 'redux-json-api-module';

const RecordItem = ({ itemTitle, userName }) => (
  <li>{`${itemTitle} by ${userName}`}</li>
);

const mapStateToProps = (state, props) => {
  const item = getRecord(state.api, { type: 'items', id: props.id });
  const user = getRelationship(state.api, item.relationships.user);
  
  return {
    itemTitle: item.attributes.title,
    userName: user.attributes.name,
  }
};

export default connect(mapStateToProps)(RecordList)
```
