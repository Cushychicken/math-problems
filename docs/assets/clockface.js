function generateRandomTime(interval) {
    interval = interval || 1; // Default interval is 1 minute if not specified

    // Calculate random hours and minutes
    var hours = Math.floor(Math.random() * 24);
    var minutes = Math.floor(Math.random() * (60 / interval)) * interval;

    // Create a new Date object with the current date but with random hours and minutes
    var randomTime = new Date();
    randomTime.setHours(hours, minutes, 0, 0); // Setting seconds and milliseconds to 0

    return randomTime;
}

function drawClock(customTime) {
    var canvas = document.getElementById('clockCanvas');
    if (!canvas.getContext) {
        return; // Canvas not supported
    }
    var ctx = canvas.getContext('2d');
    var radius = canvas.height / 2;

    ctx.translate(radius, radius); // Move to center of canvas
    radius *= 0.90;

    drawFace(customTime);

    function drawFace(time) {
        var hour = time.getHours();
        var minute = time.getMinutes();
        var second = time.getSeconds();

        // Draw clock face
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

		// Draw the black ring
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5; // Width of the ring
        ctx.stroke();

        // Draw numbers
        ctx.font = radius * 0.15 + "px arial";
        ctx.textBaseline = "middle";
        ctx.fillStyle = 'black';
        ctx.textAlign = "center";
        for (var num = 1; num <= 12; num++) {
            var ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }

		// Draw ticks
		ctx.strokeStyle = 'black'; // Set color for ticks
		for (var i = 0; i < 60; i++) {
			var angle = (i * Math.PI / 30);
			ctx.beginPath();
			ctx.lineWidth = (i % 5 == 0) ? 3 : 2; // Make minute ticks slightly thicker
			ctx.moveTo(radius * 0.9, 0);
			ctx.lineTo(radius * 0.95, 0);
			ctx.stroke();
			ctx.rotate(angle);
			if (i % 5 != 0) { // Only rotate back for minute ticks
				ctx.rotate(-angle);
			}
		}

        // Hour hand
        hour = hour % 12;
        hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
        drawHand(ctx, hour, radius * 0.5, radius * 0.07);

        // Minute hand
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        drawHand(ctx, minute, radius * 0.8, radius * 0.07);

        // Second hand
        //second = (second * Math.PI / 30);
        //drawHand(ctx, second, radius * 0.9, radius * 0.02);

        function drawHand(ctx, pos, length, width) {
            ctx.beginPath();
            ctx.lineWidth = width;
            ctx.lineCap = "round";
            ctx.moveTo(0,0);
            ctx.rotate(pos);
            ctx.lineTo(0, -length);
            ctx.stroke();
            ctx.rotate(-pos);
        }
    }
}

// Initialize with default values on page load
var randTime = generateRandomTime(5);
document.addEventListener('DOMContentLoaded', drawClock(randTime));
