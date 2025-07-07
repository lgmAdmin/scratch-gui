function addGenerator (Blockly) {
    Blockly.Python.hello = function (block) {

        return `digitalWrite()\n`;
    };

    return Blockly;
}

exports = addGenerator;