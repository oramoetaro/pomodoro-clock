var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var state = {
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
};

var Clock = function (_React$Component) {
  _inherits(Clock, _React$Component);

  function Clock(props) {
    _classCallCheck(this, Clock);

    var _this = _possibleConstructorReturn(this, (Clock.__proto__ || Object.getPrototypeOf(Clock)).call(this, props));

    _this.state = Object.assign({}, state);
    _this.increase = _this.increase.bind(_this);
    _this.decrease = _this.decrease.bind(_this);
    _this.start = _this.start.bind(_this);
    _this.pause = _this.pause.bind(_this);
    _this.reset = _this.reset.bind(_this);
    _this.tick = _this.tick.bind(_this);
    return _this;
  }

  _createClass(Clock, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.setState({
        mins: this.state[this.state.mode].length
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.secs == 0 && this.state.mins == 0) {
        this.state.mode = this.state.mode == "session" ? "break" : "session";
        this.state.mins = this.state[this.state.mode].length;
      }
    }
  }, {
    key: "decrease",
    value: function decrease(task) {
      var obj = JSON.parse(JSON.stringify(this.state));
      var inRange = obj[task].length > obj[task].minLength;
      obj[task].length = inRange ? obj[task].length -= 1 : obj[task].minLength;

      if (obj.mode == task) {
        obj.mins = obj[task].length;
      }

      if (!obj.turnedOn) {
        this.setState(obj);
      }
    }
  }, {
    key: "increase",
    value: function increase(task) {
      var obj = JSON.parse(JSON.stringify(this.state));
      var inRange = obj[task].length < obj[task].maxLength;
      obj[task].length = inRange ? obj[task].length += 1 : obj[task].maxLength;
      if (obj.mode == task) {
        obj.mins = obj[task].length;
      }
      if (!obj.turnedOn) {
        this.setState(obj);
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.state.turnedOn) {
        this.pause();
      }
      this.setState(state);
      this.state.mins = this.state[this.state.mode].length;
    }
  }, {
    key: "start",
    value: function start() {
      this.tick();
      this.setState({ turnedOn: !this.state.turnedOn });
      this.interval = setInterval(this.tick, 1000);
    }
  }, {
    key: "pause",
    value: function pause() {
      clearInterval(this.interval);
      delete this.interval;
      this.setState({ turnedOn: !this.state.turnedOn });
    }
  }, {
    key: "tick",
    value: function tick() {
      var obj = this.state;
      obj.secs = obj.secs ? obj.secs - 1 : 59;
      obj.mins = obj.secs == 59 ? obj.mins - 1 : obj.mins;
      this.setState(obj);
    }
  }, {
    key: "render",
    value: function render() {
      var currentTask = this.state[this.state.mode];
      return React.createElement(
        "div",
        { id: "clock", className: "border rounded text-center" },
        React.createElement(Timer, {
          mins: ('0' + this.state.mins).slice(-2),
          secs: ('0' + this.state.secs).slice(-2),
          label: currentTask.timerLabel
        }),
        React.createElement(
          "div",
          { id: "control-panel" },
          React.createElement(Adjuster, Object.assign({}, this.state.session, {
            increase: this.increase,
            decrease: this.decrease
          })),
          React.createElement(Adjuster, Object.assign({}, this.state.break, {
            increase: this.increase,
            decrease: this.decrease
          })),
          React.createElement(StartControls, {
            startPause: this.state.turnedOn ? this.pause : this.start,
            reset: this.reset
          })
        )
      );
    }
  }]);

  return Clock;
}(React.Component);

function Adjuster(props) {
  return React.createElement(
    "div",
    { id: "adjuster", className: "my-3" },
    React.createElement(
      "div",
      { className: "display-4 d-flex justify-content-center" },
      React.createElement(
        "div",
        { className: "text-right",
          onClick: function onClick() {
            return props.decrease(props.timerLabel);
          } },
        React.createElement("i", { className: "fa fa-caret-left" })
      ),
      React.createElement(
        "div",
        { className: "mx-3" },
        React.createElement(
          "span",
          null,
          ('0' + props.length).slice(-2)
        )
      ),
      React.createElement(
        "div",
        { className: "text-left",
          onClick: function onClick() {
            return props.increase(props.timerLabel);
          } },
        React.createElement("i", { className: "fa fa-caret-right" })
      )
    ),
    React.createElement(
      "div",
      null,
      props.ctrlLabel
    )
  );
}

function StartControls(props) {
  return React.createElement(
    "div",
    { id: "toggle-control", className: "my-3" },
    React.createElement(
      "button",
      { className: "btn btn-dark mx-1 px-4",
        onClick: props.startPause
      },
      React.createElement("i", { className: "fa fa-power-off mr-2" }),
      React.createElement(
        "span",
        null,
        "Start"
      )
    ),
    React.createElement(
      "button",
      { className: "btn btn-dark mx-1 px-4",
        onClick: props.reset
      },
      React.createElement("i", { className: "fa fa-sync-alt mr-2" }),
      React.createElement(
        "span",
        null,
        "Reset"
      )
    )
  );
}

function Timer(props) {
  return React.createElement(
    "div",
    { id: "timer" },
    React.createElement(
      "div",
      { className: "display-2" },
      props.mins,
      ":",
      props.secs
    ),
    React.createElement(
      "span",
      { className: "h4" },
      props.label
    )
  );
}

ReactDOM.render(React.createElement(Clock, null), document.getElementById('clock-wrapper'));