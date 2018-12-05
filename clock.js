var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function ControlPanel(props) {
  return React.createElement(
    "div",
    { id: "controls", className: "col-lg-4" },
    React.createElement(LengthCrl, Object.assign({}, props.session, {
      decrease: props.decrease,
      increase: props.increase
    })),
    React.createElement(LengthCrl, Object.assign({}, props.break, {
      decrease: props.decrease,
      increase: props.increase
    })),
    React.createElement(ResetBtn, { reset: props.reset }),
    React.createElement(StartBtn, { start: props.start })
  );
}

function LengthCrl(props) {
  return React.createElement(
    "div",
    { className: "length-control my-2" },
    React.createElement(
      "div",
      { className: "display-4" },
      React.createElement(Decrement, {
        name: props.timerLabel,
        decrease: props.decrease
      }),
      React.createElement(Length, {
        name: props.timerLabel,
        length: props.length
      }),
      React.createElement(Increment, {
        name: props.timerLabel,
        increase: props.increase
      })
    ),
    React.createElement(
      "span",
      { className: "h6" },
      props.ctrlLabel
    )
  );
}

function Length(props) {
  return React.createElement(
    "span",
    { id: props.name + "-length", className: "mx-2" },
    ('0' + props.length).slice(-2)
  );
}

function Decrement(props) {
  return React.createElement(
    "span",
    { id: props.name + "-decrement",
      onClick: function onClick() {
        props.decrease(props.name);
      } },
    React.createElement("i", { className: "fas fa-xs fa-angle-left" })
  );
}

function Increment(props) {
  return React.createElement(
    "span",
    { id: props.name + "-increment",
      onClick: function onClick() {
        props.increase(props.name);
      } },
    React.createElement("i", { className: "fas fa-xs fa-angle-right" })
  );
}

function ResetBtn(props) {
  return React.createElement(
    "div",
    { id: "reset", className: "float-right", onClick: props.reset },
    React.createElement("i", { className: "fas fa-sync-alt fa-lg" })
  );
}

function StartBtn(props) {
  return React.createElement(
    "div",
    {
      id: "start_stop",
      className: "float-right mr-3",
      onClick: props.start
    },
    React.createElement("i", { className: "fas fa-play fa-lg" }),
    React.createElement("i", { className: "fas fa-pause fa-lg" })
  );
}

function Timer(props) {
  return React.createElement(
    "div",
    { id: "timer", className: "col-lg-8 border-right" },
    React.createElement(
      "p",
      { id: "time-left", className: "display-1 m-0" },
      ('0' + props.minutes).slice(-2),
      ":",
      ('0' + props.seconds).slice(-2)
    ),
    React.createElement(
      "p",
      { id: "timer-label" },
      props.label
    )
  );
}

var defaultState = {
  break: {
    ctrlLabel: "Break Length",
    timerLabel: "break",
    maxLength: 60,
    minLength: 1,
    length: 1
  },
  session: {
    ctrlLabel: "Session Length",
    timerLabel: "session",
    maxLength: 60,
    minLength: 1,
    length: 1
  },
  mode: "session",
  turnedOn: false
};

var Clock = function (_React$Component) {
  _inherits(Clock, _React$Component);

  function Clock(props) {
    _classCallCheck(this, Clock);

    var _this = _possibleConstructorReturn(this, (Clock.__proto__ || Object.getPrototypeOf(Clock)).call(this, props));

    _this.state = defaultState;
    return _this;
  }

  _createClass(Clock, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.reset();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.interval = setInterval(function () {
        return _this2.tick();
      }, 1000);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearInterval(this.interval);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.setState(defaultState);
      var mins = this.state.mode == "session" ? this.state.session.length : this.state.break.length;

      this.setState({
        minutes: mins,
        seconds: 0
      });
    }
  }, {
    key: "decrease",
    value: function decrease(name) {
      var task = this.state[name];
      if (task.length > task.minLength) {
        task.length -= 1;
        this.setState(_defineProperty({
          minutes: task.length
        }, task, task));
      }
    }
  }, {
    key: "increase",
    value: function increase(name) {
      var task = this.state[name];
      if (task.length < task.maxLength) {
        task.length += 1;
        this.setState(_defineProperty({
          minutes: task.length
        }, task, task));
      }
    }
  }, {
    key: "tick",
    value: function tick() {
      var obj = {};

      switch (this.state.seconds) {
        case 0:
          {
            obj.seconds = 59;
            if (this.state.minutes) {
              obj.minutes = this.state.minutes - 1;
            } else {
              obj.minutes = this.state.mode == "session" ? this.state.break.length - 1 : this.state.session.length - 1;
              obj.mode = this.state.mode == "session" ? "break" : "session";
            }break;
          }
        default:
          {
            obj.seconds = this.state.seconds - 1;
          }
      }

      if (this.state.turnedOn) {
        this.setState(obj);
      }
    }
  }, {
    key: "start",
    value: function start() {
      this.setState({
        turnedOn: !this.state.turnedOn
      });
    }
  }, {
    key: "render",
    value: function render() {

      this.activated = this.state.mode == "session" ? this.state.session : this.state.break;

      return React.createElement(
        "div",
        { id: "clock", className: "row col-lg-4 mx-auto py-3 border rounded" },
        React.createElement(Timer, {
          minutes: this.state.minutes,
          seconds: this.state.seconds,
          label: this.activated.timerLabel
        }),
        React.createElement(ControlPanel, {
          start: this.start.bind(this),
          reset: this.reset.bind(this),
          decrease: this.decrease.bind(this),
          increase: this.increase.bind(this),
          "break": this.state.break,
          session: this.state.session
        })
      );
    }
  }]);

  return Clock;
}(React.Component);

ReactDOM.render(React.createElement(Clock, null), document.getElementById('clock-wrapper'));