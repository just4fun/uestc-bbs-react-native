import React, { Component } from 'react';
import {
  View,
  AlertIOS
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import SearchBar from 'react-native-search-bar';
import TopicList from '~/components/TopicList/TopicList';
import LoadingSpinner from '~/components/LoadingSpinner/LoadingSpinner';
import MENUS from '~/constants/menus';
import {
  fetchSearchList,
  cancelSearchList,
  resetSearchList
} from '~/modules/topic/searchList/searchList.ducks';

import mainStyles from '~/common/styles/Main.style';

class Search extends Component {
  static navigationOptions = {
    title: MENUS.search.title
  }

  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
      focus: false
    };
  }

  componentDidMount() {
    this.getSearchBarFocus();
  }

  componentWillUnmount() {
    this.props.cancelSearchList();
    this.props.resetSearchList();
  }

  componentWillReceiveProps(nextProps) {
    const { searchList } = nextProps;
    if (searchList.errCode) {
      AlertIOS.alert('提示', searchList.errCode);
      // Clean error message.
      this.props.resetSearchList();
    }
  }

  getSearchBarFocus() {
    this.refs.searchBar.focus();
  }

  getSearchBarBlur() {
    this.refs.searchBar.unFocus();
  }

  refreshTopicList({ page, isEndReached }) {
    // Search topic list can not be pulled to refresh,
    // so there is no need to invalidate topic list here,
    // this method is only used for end reach refreshing.
    this.props.fetchSearchList({
      keyword: this.state.keyword,
      isEndReached,
      sortType: 'all',
      page
    });
  }

  handleChange(keyword) {
    this.setState({ keyword });
  }

  handleSearch() {
    this.getSearchBarBlur();
    this.refreshTopicList({});
  }

  render() {
    const {
      navigation,
      searchList,
      userId,
      settings
    } = this.props;

    return (
      <View style={mainStyles.container}>
        <SearchBar
          ref='searchBar'
          placeholder='请输入关键字'
          editable={!searchList.isRefreshing}
          showsCancelButton={this.state.focus}
          onFocus={() => this.setState({ focus: true })}
          onChangeText={keyword => this.handleChange(keyword)}
          onSearchButtonPress={() => this.handleSearch()}
          onCancelButtonPress={() => this.getSearchBarBlur()} />
        {searchList.isRefreshing && (
          <LoadingSpinner text='正在搜索' />
        ) || (
          <TopicList
            ref={component => this.searchList = component}
            currentUserId={userId}
            navigation={navigation}
            settings={settings}
            isSearch={true}
            topicList={searchList}
            refreshTopicList={this.refreshTopicList.bind(this)} />
        )}
      </View>
    );
  }
}

function mapStateToProps({ searchList, session, settings }) {
  return {
    userId: _.get(session, ['data', 'uid']),
    searchList,
    settings
  };
}

export default connect(mapStateToProps, {
  fetchSearchList,
  cancelSearchList,
  resetSearchList
})(Search);
