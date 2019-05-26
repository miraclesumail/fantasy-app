import { FETCHING_PEOPLE, FETCHING_PEOPLE_SUCCESS, FETCHING_PEOPLE_FAILURE } from './constants'
import update from 'immutability-helper';

const initialState = {
  people: 'dddddd',
  isFetching: false,
  error: false,
  refreshTime:'', // 记录上次刷新时间
  gamesList: {
      hotRecommend:[
        {name:'植物33', img: require('../imgs/qq2.jpg'), hot:3, isFavorite:true, id:111},
        {name:'植物11', img: require('../imgs/qq1.jpg'), hot:4, isFavorite:false, id:121},
        {name:'植物22', img: require('../imgs/qq3.jpg'), hot:3, isFavorite:false, id:131}
      ],
      newProducts: [
        {name:'游戏王1', img: require('../imgs/qq2.jpg'), release_date:'2019-04-12', avg_person:100, avg_amount:1000, avg_bonus:888, avg_score:7.8}, 
        {name:'游戏王2', img: require('../imgs/qq1.jpg'), release_date:'2019-04-10', avg_person:120, avg_amount:1100, avg_bonus:828, avg_score:8.8}, 
        {name:'游戏王3', img: require('../imgs/qq3.jpg'), release_date:'2019-04-05', avg_person:130, avg_amount:900, avg_bonus:858, avg_score:8.6}, 
      ]
  }
}

export default function peopleReducer (state = initialState, action) {
  switch (action.type) {
    case FETCHING_PEOPLE:
      return {
        ...state,
        people: [],
        isFetching: true
      }
    // case 'changePeople':
    //   return {
    //       ...state,
    //       people: action.people
    //   }
    case 'changePeople':
      return update(state, {
         people: {
             $set: 'aaaaa'
         }
      })
    case 'updateRefreshTime':
      console.log('ffre');
      console.log(action.refreshTime);
      return update(state, {
         refreshTime: {
             $set: action.refreshTime
         }
      })  
    case 'toggleLike': 
      let idx;
      const tempList = state.gamesList.hotRecommend.filter((item, index) => {
            const flag = action.id == item.id;
            flag && (idx = index);
            return flag;
      })[0];

      tempList.isFavorite = !tempList.isFavorite;
      const hotRecommend = update(state.gamesList.hotRecommend, {[idx]: {$set: tempList}})
      console.log(hotRecommend);
      return update(state, {
           gamesList: {
                hotRecommend: {
                   $set: hotRecommend.slice()
                }
           }
      })
    case 'deleteItem':
      const items = state.gamesList.hotRecommend.slice();
      items.splice(action.index, 1);
      return update(state, {
           gamesList: {
                hotRecommend: {
                   $set: [...items]
                }
           }
      })
    /**
     * const collection = [1, 2, {a: [12, 17, 15]}];
      const newCollection = update(collection, {2: {a: {$splice: [[1, 1, 13, 14]]}}});
       => [1, 2, {a: [12, 13, 14, 15]}]
     * 
     */
    case 'toTop':
      const list = state.gamesList.hotRecommend.slice()[action.index];
      // 连续操作
      const tempRecommend =  update(state.gamesList.hotRecommend, {$splice: [[action.index, 1]], $unshift: [list]});
      //const finalRecommend = update(state.gamesList.hotRecommend, {$unshift: [list]});
      return update(state, {
           gamesList: {
                hotRecommend: {
                   $set: tempRecommend.slice()
                }
           }
      })
    case FETCHING_PEOPLE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        people: action.data
      }
    case FETCHING_PEOPLE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true
      }
    default:
      return state
  }
}