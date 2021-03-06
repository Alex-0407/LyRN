import * as Types from '../constants/city';
import _ from '../util';
import config from '../config';

const GET_HISTORY_CITY = { type: Types.GET_HISTORY_CITY };
const GET_HOT_CITY = { type: Types.GET_HOT_CITY };
const GET_CITY_LIST = { type: Types.GET_CITY_LIST };
const GET_CURRENT_CITY = { type: Types.GET_CURRENT_CITY };

// 选择城市
const SELECT_CITY = { type: Types.SELECT_CITY };

const getCityList = (cityName) => async (dispatch) => {
    const uri = 'uniontrain/trainapi/GetCityStationList';

    const { data } = await _.get(uri, {
        para: {
            'headtime': Number(new Date()),
            'memberId': '',
            'platId': 432,
            'requestType': 3,
            'headct': 0,
            'headus': 3,
            'headver': '2.14.0.2',
            cityName
        }
    });

    const
        { data: res = {} } = data,
        { TrainStation = {} } = res,
        { StationList = [] } = TrainStation;

    dispatch({
        ...GET_CITY_LIST,
        cityList: StationList
    });
};

const getHotCities = () => async (dispatch) => {

    // Storage.remove({ key: 'trainhotcities' });
    const data = await Storage.load({
        key: 'trainhotcities',
        // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
        autoSync: true,
        // syncInBackground(默认为true)意味着如果数据过期，
        // 在调用sync方法的同时先返回已经过期的数据。
        // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
        syncInBackground: true
    });

    const { list = [] } = data;

    dispatch({
        ...GET_HOT_CITY,
        hotcities: list
    });

};

const getHistoryCities = () => async (dispatch) => {
    try {
        const data = await Storage.getAllDataForKey('trainhistorycities');

        console.log(data);
        dispatch({
            ...GET_HISTORY_CITY,
            historycities: data
        });
    } catch (err) {
        console.log(err);
    }

};

const selectCity = (data) => (dispatch) => {
    dispatch({
        ...SELECT_CITY,
        obj: data
    });
};

const getCurrentLocation = (location) => (dispatch) => {
    const uri = 'http://restapi.amap.com/v3/geocode/regeo';

    _.get(uri, {
        key: config.key,
        location
    })
        .then((response) => {
            const { data } = response;

            dispatch({
                ...GET_CURRENT_CITY,
                currentCity: data
            });
        });
};

export default {
    getCityList,
    getHistoryCities,
    getHotCities,
    selectCity,
    getCurrentLocation
};
