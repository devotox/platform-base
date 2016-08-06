# Best Practices

#### General
  * Run all commands from root of application
  * If new global npm module is used then also add it to gulpfile.js (install-globals task)

#### GIT
  * Never work on your master branch - This should only be used to synchronize with the upstream repo
  * Every new ticket worked on should have its own branch - `git checkout -b DW-123`
  * This branch will now send a pull request to the upstream master branch and ONLY after it is merged
  * `git fetch upstream; git merge --no-edit upstream/master`

#### CSS / SCSS
  * Always use .scss files rather than css
  * Break up scss files per page / per module and import them all in app.scss

#### JS
  * All files should not be more than 500 lines long
  * Always put this at top of ember apps `import Ember from 'ember';`
  * Always fix all JSHint errors as they show up or they will grow too large and tedious


### Javascript
  * All files must pass the linting process. We use JSHint.
  * Always use the `===` and `!==` to test equality and inequalities
  * All assignment operations should end with a semicolon ( e.g.)

```javascript
	var bar = function(){

	};


	function foo() {

	} //no semicolon at the end
 ```

* Bodies of conditional or loop statements must be wrapped in braces

>	Do this:
>
>		if (true) {
>			while(running) {
>				foo();
>			}
>		}
>		bar();
>
>	Don't do this:
>
>		if (true)
>			while(running)
>				foo();
>			bar();


* Use `||`, `&&` syntax in place of ternary operators where possible

> Do this
> ```javascript
>	function foo(param, maybeParam) {
>		var text = maybeParam || '';
>		var local = (param && param.local) || 'local';
>		// do stuff
>  	}
> ```
>
> Not this
> ```javascript
> 	function foo(param, maybeParam) {
>		var text = (maybeParam) ? maybeParam : '';
>		var local = (param && param.local) ? param.local : 'local';
> 	}
> ```


* Prefer `forEach` construct over for looks


* Use single quotes for strings

> Do this:
> ```javascript
>	var good = 'mystring';
> ```
>
> Not this:
>
> ```javascript
>	var bad =  "badstring";
> ```

* Ternary operators should have parentheses around the condition only

>```javascript
>function foo() {
>	return (foo.name === 'foo') ? 'awesome' : 'meh';
>}
>```

* when using something like typeof param === "undefined" || param === null ( use !param )

>	Do this:
>	```javascript
>	function foo(param) {
>		if(!param) {
>			return;
>		}
>		return bar();
>	}
>	```
>
>  	Not this:
>	```javascript
>	function bad(param) {
>		if (typeof param === 'undefined' || param === null) {
>			return;
>		}
>		return bar();
>	}
>   ```

* Always use descriptive variable names
Do this:
```javascript
	function sum(listOfNumbers) {
		return listOfNumbers.reduce(function (previous, next) {
			return previous + next;
		}, 0);
	}

	var total = sum([1,2,3,4,5]);
```
Not this:
```javascript
	function sum(arr) {
		return arr.reduce(function (a, b) {
			return a + b;
		}, 0);
	}

	var t = sum([1,2,3,4,5]);
```

* declare all variables at top of function
* never redeclare variables
* remove unused variables
* strip out all `console.log('')` statements
* strip out all commented out code segments

### SQL
##### Security best practices
* All stored procedures that access sensitive information must receive an _auth_token as the first input parameter; failure to receive this should generate an exception.
  * Whenever accessing sensitive information (patient data), you must confirm that the provided _auth_token has an internal role (v2_f_has_intranet_role) sufficient to access the data, or that the account referenced has read/write authorization for the profile record in question (v2_f_is_permissioned); this is a row-level security policy that acts as the final barrier to our sensitive data
* No stored procedure that accesses sensitive information should be granted permission to the website login role unless absolutely necessary; intranet-functionality should only be permissioned to the intranet login role unless absolutely critical for website operation.
* Tables/views should never be permissioned to the intranet/website login roles; instead they should be granted execute access on specific stored_procedures - this will grant them all data access necessary to execute the code written within the sproc.
* Wherever practical, updates from the website and intranet should not delete records, but rather, should set a status field equal to 'deleted'; get sprocs should be written to only retrieve non-deleted records from the website (but all from the intranet). DB maintenance scripts should be used to ultimately purge the data.

##### Data Definition
* Modular code should be written wherever possible
  * Use functions to perform often-repeated tasks (e.g. security checks or uri generation)
  * Use modular calls to other stored procedures to simplify procedures (e.g. use a _get_ procedure to return the output of a _create_ or _update_ stored procedure).
* Triggers can be used but should be avoided unless necessary (they often significantly increase system complexity, but are sometimes preferable to any other solution)
* Naming conventions
  * domains: <name>
  * tables: t_<name> - there is no version associated with a table
    * <name> is singular unless the table is a list of commonly used objects (e.g. keywords)
    * <name> should be prepended by datamining_ for any processed mining data
  * sprocs: <version>_sp _<name>
    * <name> should be prepended by admin_ for any frequently used utility function that the DBA uses (or which is run via nightly cron jobs)
  * functions: <version>_f _<name>
  * triggers: <version>_sp _trigger _<name>
  * types: <version>_type _<name>
* Wherever practical, tables should be constructed to include an id field as the primary key
* Wherever practical, tables should include timestamp_created, timestamp_modified, creator (where creator refers to the account UUID of the individual who created it)
* Whenever versioning is required, tables should be structured such that updates insert new records, and that gets retrieve the latest timestamped record; this permits a full audit trail of the data (and potential for easily reverting to a previous record)
* BOOL fields should be named in a question format (e.g. is_verified, has_booking_enabled)
* TIMESTAMPS should be of TIMESTAMP WITH TIME ZONE format to permit relocation of DB if needed
* All objects created in the DB should be included in the initialize scripts so that an empty instance of the DB can be created via the command line script

##### Stored Procedures
* Always use PLPGSQL; if you see a stored procedure written in PLSQL rewrite it to use PLPGSQL
* SETS should be returned when it seems likely that the same data structure will be used in multiple procedures; otherwise TABLES or BOOLEANS or INTs can be returned.
* All input parameters should be defined using a leading underscore (e.g. _patient, _auth_token) to easily identify when they are being used without validation within the query body
* All variables defined in the procedure should be first declared within the DECLARE section (before the BEGIN)
  * these variables should be declared without underscores
  * any variables used for bit flags should be defined in all capitals (e.g. TYPE_PRACTICE)
* input variables should be validated before being used whenever they are required for successful completion of query or wherever incorrect values have the potential to damage the data integrity
* RAISE EXCEPTIONS that should communicate a 500 error back to the client do not need to include ERRCODEs. These should be limited to input data that prevents execution of the query.
* RAISE EXCEPTIONS that need to communicate information back to the client (e.g. 400 or 403) should be accompanied with USING ERRCODE = '#####' and the api_handler must be configured to handle this errorcode. This should be used for input values that would provide responses (e.g. empty set because of an expired _auth_token) that might not otherwise be expected.
* Whenever possible, leverage a CRUD behavior so that the sp_get_ call can be invoked at the end of the sp_update_ sp_delete_ and sp_create_ calls.
* Example of a proto-typical stored_procedure:

```
CREATE OR REPLACE FUNCTION v2_sp_get_data(
    IN _auth_token UUID DEFAULT NULL,
    IN _filter VARCHAR DEFAULT ''
)

 RETURNS SETOF v2_type_data AS $$

<<outerblock>>
DECLARE
    record v2_type_data;
BEGIN
    IF(_auth_token IS NULL) THEN
        RAISE EXCEPTION 'auth_token is required';
    END IF;

    FOR record IN (
        SELECT      d.patient_name
                    d.patient_age
        FROM        t_data d
        WHERE       v2_f_has_intranet_role( _auth_token, 'intranet_role' )
                    OR v2_f_is_permissioned( _auth_token, 'read', 'patient', d.patient_id )
                    AND unaccent(d.patient_name) ILIKE ( '%' || COALESCE(unaccent(_filter), '') || '%' )
        ORDER BY    d.patient_name DESC
    )
    LOOP
        RETURN NEXT record;
    END LOOP;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION v2_sp_get_data(uuid, varchar) TO <db_login_role>;
```

### SCSS


### Shell