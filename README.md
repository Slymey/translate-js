# translate-js
Very simple js library for translating a web page.

It is recomended to download and serve the library from your own server.

## How to use
Include file into your site
```html
<script src="https://slymey.github.io/translate-js/translate.js"></script>
```
<br>

A translatable element has the class "**translatable**" and either a **translation-text** or a **translation-id** attribute.<br>
**translation-text**: text that will be inserted into the element, dollar signs (**$**) specify translatable text and percent signs (**%**) specify values that are inserted into the translated text. To insert either character raw just double it ($$ / %%).<br>
**translation-value**: comma seperated list of **name:value** pairs of values that will be inserted into the text.<br>
**translation-id**: specifies the id of of the **translation-text** in the base file.
```html
<title class="translatable" translation-text="$title$" translation-value="num:2">Title</title>
<h1 class="translatable" translation-text="$flag-title$">The flag</h1>
<div if="flagdiv" class="translatable" translation-id="flag"></div>
```
Example of lang_en.json
```json
{
    "title":"Title %num%",
    "flag-title":"This is the UK flag",
    "flag":"uk-flag.gif"
}
```
Example of baseLang.json
```json
{
    "flag":"<img id='flag' src='https://www.worldometers.info/img/flags/$flag$'>"
}
```
<br>

Translate your site by simply calling **translate(...)**. Make sure to parse your json with **JSON.parse(...)**.<br>
```javascript
translate(document, language_obj);
//or
translate(document, language_obj, base_obj);
```
<br>

You can olso specify values to be inserted during translation.<br>
Mandatory values are always inserted first, then values specified in the **translation-value** attribute, and lastly optional values. If a value is not found it inserts nothing.
```javascript
translate(document, language_obj, base_obj, mandatory_values);
//or
translate(document, language_obj, base_obj, mandatory_values, optional_values);
```
<br>

If you enabled trusted type policy in your response header make sure to whitelist **translate-default** as an allowed policy name or provide your own policy via type_policy.
```javascript
translate(document, language_obj, base_obj, mandatory_values, optional_values, type_policy);
```
<br>

If you have your translation recurse quite deeply you can change the maximum depth to something other than 32.
```javascript
translate(document, language_obj, base_obj, mandatory_values, optional_values, type_policy, max_depth);
```
