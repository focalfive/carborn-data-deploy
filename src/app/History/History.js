import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';

var appHistory = null;

export default (() => {
    if(appHistory == null) {
        appHistory = useRouterHistory(createHashHistory)({queryKey: false});
    }

    return appHistory;
});
