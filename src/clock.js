const defaultState = {
  session: {
    ctrlLabel: "Session Length",
    timerLabel: "Session Time",
    maxLength: 60,
    minLength: 1,
    length: 25
  },
  break: {
    ctrlLabel: "Break Length",
    timerLabel: "Break Time",
    maxLength: 60,
    minLength: 1,
    length: 5
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentWillMount() {
    this.turnedOn = false;
    this.mode = "session";
    this.state.mins = this.state[this.mode].length;
    this.state.secs = 5;
  }

  render() {
    const currentTask = this.state[this.mode];
    return(
      <div id="clock" className="border rounded text-center">
        <Timer
          mins = {('0'+this.state.mins).slice(-2)}
          secs = {('0'+this.state.secs).slice(-2)}
          label = {currentTask.timerLabel}
        />
        <div id="control-panel">
          <ToggleCtrl />
        </div>
      </div>
    );
  }
}

function ToggleCtrl() {
  return(
    <div id="toggle-control" className="my-3">
      <button className="btn btn-dark mx-1 px-4">
        <i className="fa fa-power-off mr-2"></i>
        <span>Start</span>
      </button>
      <button className="btn btn-dark mx-1 px-4">
        <i className="fa fa-sync-alt mr-2"></i>
        <span>Reset</span>
      </button>
    </div>
  );
}

function Timer(props) {
  return(
    <div id="timer">
      <div className="display-2">
        {props.mins}:{props.secs}
      </div>
      <span className="h4">
        {props.label}
      </span>
    </div>
  );
}

ReactDOM.render(
  <Clock />,
  document.getElementById('clock-wrapper')
);