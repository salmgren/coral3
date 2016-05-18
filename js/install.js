$.fn.serializeObject = function()
{
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (this.value === "")
			return;
		if (o[this.name] !== undefined) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

function submit_install_step(dataToSubmit)
{
	if (typeof dataToSubmit === "undefined")
		dataToSubmit = {};
	dataToSubmit.installing = true;
	$.post("install.php", dataToSubmit, function(data){
		$(".main").animate({"opacity": 0, "paddingRight": 30 }, 500, function(){
			if (data.redirect_home)
			{
				$(".installation_stuff").hide();
				var countdown = 10;
				$(".redirection .countdown").text(countdown);
				var $holder = $(".completed_test_holder");
				data.completed_tests.forEach(function(test){
					$holder.append($("<li>").addClass("completed_test").text(test));
				});
				$(".redirection").fadeIn();
				setTimeout(injectCssForAnimation, 1200);
				setInterval(function(){
					if (countdown-- <= 0)
						window.location.href = "index.php";
					else
						$(".redirection .countdown").text(countdown);
				}, 1000);
			}
			else {
				$(".section-title, .messages, .mainbody").empty();

				if (typeof data.title !== "undefined")
				$(".section-title").html(data.title);

				if (typeof data.messages !== "undefined")
				{
					if (data.messages)
					{
						data.messages.forEach(function(msg){
							$(".messages").append(
								$("<div>").addClass("message").html(msg)
							);
						});
					}
				}

				if (typeof data.body !== "undefined")
				$(".mainbody").html(data.body);
				$("[data-toggle-section]").each(function(){
					var $ts = $( $(this).attr("data-toggle-section") );
					$ts.css('height', $ts.height());
				});
			}

			$(".main").css({ "opacity": 0, "paddingLeft": 30 });
			$(".main").animate({ "opacity": 1, "paddingLeft": 0 }, 300, function(){
				$(".percentageComplete").animate({ "width": data.completion+"%" }, 1000);
			});
		});
		console.log(data.completed_tests);
	}, 'json');
}
$(document).ready(function(){
	console.log("ready");
	$(".main").css({"opacity": 0});
	submit_install_step();
}).on("submit", function(){
	var data = $("form input:visible").serializeObject();
	submit_install_step(data);
	return false; // Prevent submit
}).on("click", ".toggleSection", function(){
	var original_message = $(this).html();
	$(this).html($(this).attr("data-alternate-message"));
	$(this).attr("data-alternate-message", original_message);
	var section_to_toggle = $(this).attr("data-toggle-section");
	$(section_to_toggle).slideToggle();
});

function injectCssForAnimation()
{
	var head  = document.getElementsByTagName('head')[0];
	var link  = document.createElement('link');
	link.id   = "checkmarkAnimation";
	link.rel  = 'stylesheet';
	link.type = 'text/css';
	link.href = 'css/checkmarkAnimation.css';
	link.media = 'all';
	head.appendChild(link);
}
