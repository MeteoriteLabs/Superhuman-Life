import ToggleSwitchButton from "../../components/ToggleSwitchButton"

function index() {
  return (
    <div>
        <h2>Notification Settings</h2>
        <ToggleSwitchButton id={1} name="hello" value={true} label={'a'} defaultChecked={true} disabled={false} onChange={()=>{}}/>
    </div>
  )
}

export default index
