import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight
} from 'react-native';
import moment from 'moment';
import FORUMS from '~/constants/forums';

import colors from '~/common/styles/colors.style';
import styles from './SubForumItem.style';

export default SubForumItem = (props) => {
  const {
    navigation,
    isForumListModal,
    subForum,
    subForum: {
      board_id,
      board_name,
      td_posts_num,
      posts_total_num,
      topic_total_num,
      last_posts_date
    }
  } = props;
  const lastPostDate = moment(+last_posts_date).startOf('minute').fromNow();
  const boardImage = FORUMS[board_id] || require('~/images/board_img/default.png');

  return (
    <TouchableHighlight
      key={board_id}
      underlayColor={colors.underlay}
      onPress={() => {
        if (isForumListModal) {
          props.handleSelectForum(subForum);
        } else {
          navigation.push('Forum', subForum);
        }
      }}>
      <View style={styles.subForum}>
        <View style={styles.left}>
          <Image
            style={styles.icon}
            source={boardImage} />
        </View>
        <View style={styles.right}>
          <View style={styles.leftInfo}>
            <Text style={styles.text}>{board_name}</Text>
            <Text style={[styles.number, styles.subForumLastPostDate]}>{lastPostDate}</Text>
          </View>
          <View style={styles.rightInfo}>
            <View style={styles.row}>
              <Text style={styles.numberText}>主题：</Text>
              <Text style={[styles.number, styles.postsNumber]}>{topic_total_num}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.numberText}>贴子：</Text>
              <Text style={[styles.number, styles.postsNumber]}>{posts_total_num}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.numberText}>今日：</Text>
              <Text style={[styles.number, styles.todayNumber]}>{td_posts_num}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}
