const state = {
  turnedOn: false,
  mode: "session",
  mins: 0,
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
    this.state = {...state};
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.reset = this.reset.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentWillMount() {
    this.setState({
      mins: this.state[this.state.mode].length
    });
  }

  componentDidUpdate() {
    if (this.state.secs == 0 && this.state.mins == 0) {
      this.state.mode = 
      this.state.mode == "session" ? "break" : "session";
      this.state.mins = this.state[this.state.mode].length;
    }
  }

  decrease(task) {
    let obj = JSON.parse(JSON.stringify(this.state));
    const inRange = obj[task].length > obj[task].minLength;
    obj[task].length = inRange ?
    obj[task].length -=1:
    obj[task].minLength;
    
    if (obj.mode == task) {
      obj.mins = obj[task].length;
    }

    if (!obj.turnedOn) {
      this.setState(obj);
    }
  }

  increase(task) {
    let obj = JSON.parse(JSON.stringify(this.state));
    const inRange = obj[task].length < obj[task].maxLength;
    obj[task].length = inRange ?
    obj[task].length +=1:
    obj[task].maxLength;

    if (obj.mode == task) {
      obj.mins = obj[task].length;
    }

    if (!obj.turnedOn) {
      this.setState(obj);
    }
  }

  reset() {
    let obj = JSON.parse(JSON.stringify(state));
    if (this.state.turnedOn) {this.pause();}
    obj.mins = obj[obj.mode].length;
    this.setState(obj);
  }

  start() {
    this.tick();
    this.setState({turnedOn: !this.state.turnedOn});
    this.interval = setInterval(this.tick, 1000);
  }

  pause() {
    clearInterval(this.interval);
    delete this.interval;
    this.setState({turnedOn: !this.state.turnedOn});
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
            startPause = {
              this.state.turnedOn ? this.pause : this.start
            }
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