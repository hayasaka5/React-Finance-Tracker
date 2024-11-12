import LeftMenu from "./LeftMenu";
import Header from "./Header";
import SettingsModule from "./SettingsModule";
import styles from './Settings.module.scss'
function Settings(){
    return(
        <div className={styles.Settings}> 
            <Header section_name={'Settings'}></Header>
            <SettingsModule></SettingsModule>
        </div>
    )
}
export default Settings;