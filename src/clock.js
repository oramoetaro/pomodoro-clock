const defaultState = {
  turnedOn: false,
  mode: "session",
  secs: 3,
  session: {
    ctrlLabel: "Session Length",
    timerLabel: "Session Time",
    maxLength: 60,
    minLength: 1,
    length: 1
  },
  break: {
    ctrlLabel: "Break Length",
    timerLabel: "Break Time",
    maxLength: 60,
    minLength: 1,
    length: 1
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentWillMount() {
    this.state.mins = this.state[this.state.mode].length;
  }

  componentDidUpdate() {
    if (this.state.secs == 0 && this.state.mins == 0) {
      this.state.mode = 
      this.state.mode == "session" ? "break" : "session";
      this.state.mins = this.state[this.state.mode].length;
    }
  }

  reset() {
    this.pause();
    this.setState(defaultState);
    this.state.mins = this.state[this.state.mode].length;
  }

  start() {
    this.tick();
    this.setState({turnedOn: !this.state.turnedOn});
    this.interval = setInterval(this.tick, 1000);
  }

  pause() {
    this.setState({turnedOn: !this.state.turnedOn});
    clearInterval(this.interval);
    delete this.interval;
  }

  tick() {
    let obj = this.state;
    obj.secs = obj.secs ? obj.secs - 1 : 59;
    obj.mins = obj.secs == 59 ? obj.mins -1 : obj.mins;
    this.setState(obj);
  }

  render() {
    const currentTask = this.state[this.state.mode];
    return(
      <div id="clock" className="border rounded text-center">
        <Timer
          mins = {('0'+this.state.mins).slice(-2)}
          secs = {('0'+this.state.secs).slice(-2)}
          label = {currentTask.timerLabel}
        />
        <div id="control-panel">
          <StartControls
            startPause = {this.state.turnedOn ? this.pause : this.start}
            reset = {this.reset}
          />
        </div>
      </div>
    );
  }
}

function StartControls(props) {
  return(
    <div id="toggle-control" className="my-3">
      <button className="btn btn-dark mx-1 px-4"
      onClick={props.startPause}
      >
        <i className="fa fa-power-off mr-2"></i>
        <span>Start</span>
      </button>
      <button className="btn btn-dark mx-1 px-4"
      onClick={props.reset}
      >
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