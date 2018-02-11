var _DEBUG_CHEAT_CONSOLE = false;
var _DEBUG_MODE = 0;
const NUMBER = "number";
const PRECISION = 100;

var debugPanel = {

	buffer: "",
	button: [
		{ name: "Move Speed: ", value: eval(makePtr("_PLAYER_MOVE_SPEED")) },
		{ name: "Dash Speed: ", value: eval(makePtr("_PLAYER_DASH_SPEED_SCALE")) },
		{ name: "Dash Reset: ", value: eval(makePtr("_MS_BETWEEN_DASHES")) },
		{ name: "Double Tap: ", value: eval(makePtr("_DOUBLE_TAP_TIMESPAN")) },
		{ name: "Stun Time:  ", value: eval(makePtr("_STUN_DURATION")) },
		{ name: "Web Speed:  ", value: eval(makePtr("_WEB_FRICTION")) },
		{ name: "Comm Keys:  ", value: eval(makePtr("player.inventory.keysCommon")) },
		{ name: "Rare Keys:  ", value: eval(makePtr("player.inventory.keysRare")) },
		{ name: "Epic Keys:  ", value: eval(makePtr("player.inventory.keysEpic")) },
		{ name: "Cur Health: ", value: eval(makePtr("player.currentHealth")) },
		{ name: "Max Health: ", value: eval(makePtr("player.maxHealth")) },
		{ name: "Debug Mode: ", value: eval(makePtr("_DEBUG_MODE")) }
	],

	selected: undefined,
	highlighted: undefined,

	x: 2,
	y: 25,
	offsetY: 8,
	width: 80,

	font: '10px Consolas',
	color: 'lime',
	highlightColor: 'yellow',
};

function drawPanelWithButtons(panel)
{
	if (!_DEBUG_CHEAT_CONSOLE)
	{
		return;
	}

	var x = panel.x;
	var y = panel.y;
	var precision = PRECISION;

	for (var i = 0; i < panel.button.length; i++)
	{
		var button = panel.button[i];
		var buttonY = y - panel.offsetY;
		var color = panel.color;

		if (button == panel.highlighted)
		{
			color = panel.highlightColor;
		}

		if (button == panel.selected)
		{
			color = panel.highlightColor;
			drawButton(button.name, panel.buffer);
		}
		else
		{
			drawButton(button.name, button.value());
		}
	}

	function drawButton(text, value)
	{
		var font = panel.font;
		var result = value;
		if (typeof value == NUMBER)
		{
			result = Math.round(value*precision)/precision;
		}
		drawText(text + result, x, y, font, color);
		y += panel.offsetY;
	}
}

function updatePanel(panel)
{
	if (!_DEBUG_CHEAT_CONSOLE)
	{
		return;
	}

	var currentY = panel.y;

    panel.highlighted = undefined;
	for (var i = 0; i < panel.button.length; i++)
	{
		var button = panel.button[i];
		var buttonY = currentY - panel.offsetY;
		var color = panel.color;

		if (mouseCanvasX > panel.x &&
			mouseCanvasX < panel.x + panel.width &&
			mouseCanvasY > buttonY &&
			mouseCanvasY < buttonY + panel.offsetY)
		{
			console.log(mouseHeld);
			if (mouseHeld)
			{
				panel.selected = button;
				panel.buffer = "";
			}
			panel.highlighted = button;
		}
		currentY += panel.offsetY;
	}
}

function panelKeyCapture(panel, evt)
{
	if (!_DEBUG_CHEAT_CONSOLE)
	{
		return;
	}

    if (panel.selected != undefined) {

        var key = evt.keyCode;
		if (key == KEY_ESCAPE) {
			panel.selected = undefined;
			panel.buffer = "";			
		}

        if (key >= KEY_NUMPAD_0 && key <= KEY_NUMPAD_9)
        {
            var num = key-96;
            panel.buffer += num.toString();
        }
        if (key >= KEY_0 && key <= KEY_9)
        {
            var num = key-48;
            panel.buffer += num.toString();
        }
        if (key == KEY_MINUS || key == KEY_NUMPAD_MINUS)
        {
            panel.buffer += "-";
        }
        if (key == KEY_PERIOD || key == KEY_NUMPAD_PERIOD)
        {
            panel.buffer += ".";
        }
        if (key == KEY_BACKSPACE)
        {
            panel.buffer = panel.buffer.slice(0, -1);
        }
        if (key == KEY_ENTER) {
            var number = Number(panel.buffer);
            if (!isNaN(number) && panel.buffer != "") {
                panel.selected.value(number);
            }

			panel.selected = undefined;
            panel.buffer = "";
        }
    }
}

function drawText(text, x, y, font, color)
{
    canvasContext.font = font;
    canvasContext.fillStyle = color;
    canvasContext.fillText(text, x, y);
}

function makePtr(varName) {
    return "(function(_val) {\n" +
        "    if (arguments.length > 0) " + varName + " = _val;\n" +
        "    return " + varName + ";\n" +
        "})";
}
