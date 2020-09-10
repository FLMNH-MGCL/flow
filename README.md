# flow

short for workflow, which this aims to improve

### What is this

flow is just a concept for now and won't be in use for quite some time, but the idea is to essentially create a parent program (i.e. flow) that holds references to and configurations for other programs / scripts. flow would then use the configs to execute these programs. The goal is to have an all inclusive piece of software that holds all of an institution's / individual's procedural programs in one place to run whenever needed.

For example, let's take the <a href="https://github.com/FLMNH-MGCL/datamatrix-reader">datamatrix</a> software written for FLMNH. I would boot up flow, 'create' a new program, enter in the path to the python script, enter in any variables or flags to be passed to the python environment, generate a run config and execute whenever needed. So if my file was called `dm_reader.py`, the run config would look something like this:

```javascript
runConfig = {
  commandPrefix: "python3 -u ",
  arguments: [{ argType, name, flag, value, description }, { ... }],
  command: "{commandPrefix} {program_location} {arguments}",
};
```

and then translate to a string and look something like this:

```bash
python3 -u /path/to/dm_reader.py --arg1 arg1_value
```

Upon execution, flow would recieve output as it is displayed from the child process (i.e. the program you are now executing) and display it to you live.

Here's a demo of simple python program that loops 3 times, and sleeps in between iterations:
<br/>

![flow demo](docs/demo.gif)

### Installation

The installation and development usage after cloning is as follows:

```bash
$ yarn
$ yarn dev
```
