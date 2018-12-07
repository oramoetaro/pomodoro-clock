const defaultState = {
  turnedOn: false,
  mode: "session",
  secs: 3,
  session: {
    ctrlLabel: "Session Length",
    timerLabel: "session",
    maxLength: 60,
    minLength: 1,
    length: 25
  },
  break: {
    ctrlLabel: "Break Length",
    timerLabel: "break",
    maxLength: 60,
    minLength: 1,
    length: 5
  }
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
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

  decrease(task) {
    const obj = this.state[task];
    const condition = obj.length > obj.minLength;
    if (!this.state.turnedOn && condition) {
      obj.length -= 1;
      this.setState({[task]: obj});
      this.state.mins = this.state[this.state.mode].length;
    }
  }

  increase(task) {
    const obj = this.state[task];
    const condition = obj.length < obj.maxLength;
    if (!this.state.turnedOn && condition) {
      obj.length += 1;
      this.setState({[task]: obj});
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
          <Adjuster
            {...this.state.session}
            increase = {this.increase}
            decrease = {this.decrease}
          />
          <Adjuster
            {...this.state.break}
            increase = {this.increase}
            decrease = {this.decrease}
          />
          <StartControls
            startPause = {this.state.turnedOn ? this.pause : this.start}
            reset = {this.reset}
          />
        </div>
      </div>
    );
  }
}

function Adjuster(props) {
  return(
    <div id="adjuster" className="my-3">
      <div className="display-4 d-flex justify-content-center">
        <div className="text-right"
          onClick = {() => props.decrease(props.timerLabel)} >
          <i className="fa fa-caret-left" />
        </div>
        <div className="mx-3">
          <span>{('0'+props.length).slice(-2)}</span>
        </div>
        <div className="text-left"
          onClick = {() => props.increase(props.timerLabel)} >
          <i className="fa fa-caret-right" />
        </div>
      </div>
      <div>{props.ctrlLabel}</div>
    </div>
  );
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