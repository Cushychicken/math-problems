---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

<h1>Math Problems</h1>
<div class="row">
	<div class="col">
		<h2>Worksheet Generators</h2>
		<ul>
		{% for worksheet in site.worksheet %}
		  <li><a href="{{ worksheet.url }}">{{ worksheet.title }}</a>
		  </li>
		{% endfor %}
		</ul>

	</div>
	<div class="col">
	</div>
</div>




