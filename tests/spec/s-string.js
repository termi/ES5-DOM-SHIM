describe('String', function() {
    "use strict";
    describe("trim", function() {
        var test = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFFHello, World!\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";

        it('trims all ES5 whitespace', function() {
            expect(test.trim()).toEqual("Hello, World!");
            expect(test.trim().length).toEqual(13);
        });
    });
	
	
	// ES6
	
    describe("trimLeft", function() {
        var test = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFFHello, World!\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
		var shouldBe = "Hello, World!\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";

        it('trims all ES5 whitespace from left', function() {
            expect(test.trimLeft()).toEqual(shouldBe);
            expect(test.trimLeft().length).toEqual(shouldBe.length);
        });
    });
    describe("trimRight", function() {
        var test = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFFHello, World!\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF";
		var shouldBe = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFFHello, World!";		
		
        it('trims all ES5 whitespace from right', function() {
            expect(test.trimRight()).toEqual(shouldBe);
            expect(test.trimRight().length).toEqual(shouldBe.length);
        });
    });
	
	
    describe("Strig.fromCodePoint", function() {
        it("0x21 is '!'", function() {
            expect(String.fromCodePoint(0x21)).toEqual('!');
        });
		
		it("unicode values: 107 is 'k'", function() {
            expect(String.fromCodePoint(107)).toEqual('k');
        });
		
		it("0 is empty string", function() {
            expect(String.fromCodePoint(0)).toEqual(String.fromCharCode(0));
        });
    });
	
	
    describe("codePointAt", function() {
        it("'A'.codePointAt(0) is 65", function() {
            expect('A'.codePointAt(0)).toEqual(65);
        });
		
		it("String.fromCodePoint(65).codePointAt(0) is 'A'.codePointAt(0)", function() {
            expect(String.fromCodePoint(65).codePointAt(0)).toEqual('A'.codePointAt(0));
        });
    });
	
	
    describe("repeat", function() {
        it("'A'.repeat(2) is 'AA'", function() {
            expect('A'.repeat(2)).toEqual('AA');
        });
    });
	
	
    describe("startsWith", function() {
        it("String.prototype.startsWith: 'test'.startsWith('t')", function()
		{
			expect('test'.startsWith('t')).toEqual(true);
		})

		it("String.prototype.startsWith: 'test me'.startsWith('t')", function()
		{
			expect('test me'.startsWith('t')).toEqual(true);
		})

		it("String.prototype.startsWith: 'test'.startsWith('test')", function()
		{
			expect('test'.startsWith('test')).toEqual(true);
		})

		it("String.prototype.startsWith: !'test'.startsWith('TEST')", function()
		{
			expect(!'test'.startsWith('есше')).toEqual(true);
		})

		it("String.prototype.startsWith: 'test me'.startsWith('test me')", function()
		{
			expect('test me'.startsWith('test me')).toEqual(true);
		})

		it("String.prototype.startsWith: !'test me'.startsWith(' me')", function()
		{
			expect(!'test me'.startsWith(' me')).toEqual(true);
		})

		it("String.prototype.startsWith: !'test me'.startsWith('me')", function()
		{
			expect(!'test me'.startsWith('me')).toEqual(true);
		})

		it("String.prototype.startsWith: !''.startsWith('a')", function()
		{
			expect(!''.startsWith('a')).toEqual(true);
		})

		it("String.prototype.startsWith: ''.startsWith('')", function()
		{
			expect(''.startsWith('')).toEqual(true);
		})

		it("String.prototype.startsWith: 'test me me'.startsWith('test')", function()
		{
			expect('test me me'.startsWith('test')).toEqual(true);
		})

		it("String.prototype.startsWith: 'test me me'.startsWith('test ')", function()
		{
			expect('test me me'.startsWith('test ')).toEqual(true);
		})

		it("String.prototype.startsWith: !'test me me'.startsWith(' test')", function()
		{
			expect(!'test me me'.startsWith(' test')).toEqual(true);
		})

		it("String.prototype.startsWith: !'m'.startsWith('me')", function()
		{
			expect(!'m'.startsWith('me')).toEqual(true);
		})

		it("String.prototype.startsWith: !'me'.startsWith('me ')", function()
		{
			expect(!'me'.startsWith('me ')).toEqual(true);
		})

		it("String.prototype.startsWith: 'test me'.startsWith('me', 2)", function()
		{
			expect(!'test me'.startsWith('me', 2)).toEqual(true);
		})

		it("String.prototype.startsWith: 'test me'.startsWith('me', '5')", function()
		{
			expect('test me'.startsWith('me', '5')).toEqual(true);
		})

		it("String.prototype.startsWith: !'test'.startsWith('test', 0)", function()
		{
			expect('test'.startsWith('test', 0)).toEqual(true);
		})

		it("String.prototype.startsWith: 'test'.startsWith('t', 0)", function()
		{
			expect('test'.startsWith('t', 0)).toEqual(true);
		})

		it("String.prototype.startsWith: 'test'.startsWith('e', 1)", function()
		{
			expect('test'.startsWith('e', 1)).toEqual(true);
		})

		it("String.prototype.startsWith: 'test'.startsWith('es', 1)", function()
		{
			expect('test'.startsWith('es', 1)).toEqual(true);
		})

		it("String.prototype.startsWith: 'test'.startsWith('tes', 0)", function()
		{
			expect('test'.startsWith('tes', 0)).toEqual(true);
		})

		it("String.prototype.startsWith: !'test'.startsWith('tes', 1)", function()
		{
			expect(!'test'.startsWith('tes', 1)).toEqual(true);
		})

		it("String.prototype.startsWith: '!test'.startsWith('t', 4)", function()
		{
			expect(!'test'.startsWith('t', 4)).toEqual(true);
		})

		it("String.prototype.startsWith: 'a'.startsWith('a', 0)", function()
		{
		expect('a'.startsWith('a', 0)).toEqual(true);
		})

		it("String.prototype.startsWith: !'a'.startsWith('a', 1)", function()
		{
		expect(!'a'.startsWith('a', 1)).toEqual(true);
		})

		it("String.prototype.startsWith: !'test me'.startsWith('me', 0)", function()
		{
		expect(!'test me'.startsWith('me', 0)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3')", function()
		{
			expect(!'123'.startsWith('3')).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3')", function()
		{
			expect(!'123'.startsWith(3)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', 0)", function()
		{
			expect(!'123'.startsWith('3', 0)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', 0)", function()
		{
			expect(!'123'.startsWith(3, 0)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', 1)", function()
		{
			expect(!'123'.startsWith('3', 1)).toEqual(true);
		})

			it("String.prototype.startsWith: !'123'.startsWith('3', 1)", function()
		{
			expect(!'123'.startsWith(3, 1)).toEqual(true);
		})

		it("String.prototype.startsWith: '123'.startsWith('3', 2)", function()
		{
			expect('123'.startsWith('3', 2)).toEqual(true);
		})

		it("String.prototype.startsWith: '123'.startsWith('3', 2)", function()
		{
			expect('123'.startsWith(3, 2)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', 3)", function()
		{
			expect(!'123'.startsWith('3', 3)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', 3)", function()
		{
			expect(!'123'.startsWith(3, 3)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', 4)", function()
		{
			expect(!'123'.startsWith('3', 4)).toEqual(true);
		})

			it("String.prototype.startsWith: !'123'.startsWith('3', 4)", function()
		{
			expect(!'123'.startsWith(3, 4)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('1', '1')", function()
		{
			expect(!'123'.startsWith('1', 1)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('1', '1')", function()
		{
			expect(!'123'.startsWith(1, 1)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('1', null)", function()
		{
			expect('123'.startsWith('1', null)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('1', null)", function()
		{
			expect('123'.startsWith(1, null)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', null)", function()
		{
			expect(!'123'.startsWith('3', null)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', null)", function()
		{
			expect(!'123'.startsWith(3, null)).toEqual(true);
		})

		it("String.prototype.startsWith: '123'.startsWith('1', -1)", function()
		{
			expect('123'.startsWith('1', -1)).toEqual(true);
		})

		it("String.prototype.startsWith: '123'.startsWith('1', -1)", function()
		{
			expect('123'.startsWith(1, -1)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', -1)", function()
		{
			expect(!'123'.startsWith('3', -1)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', -1)", function()
		{
			expect(!'123'.startsWith(3, -1)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', -3)", function()
		{
			expect(!'123'.startsWith('3', -3)).toEqual(true);
		})

		it("String.prototype.startsWith: !'123'.startsWith('3', -3)", function()
		{
			expect(!'123'.startsWith(3, -3)).toEqual(true);
		})

		it("String.prototype.startsWith: '123'.startsWith('')", function()
		{
			expect('123'.startsWith('')).toEqual(true);
		})

			it("String.prototype.startsWith: '123'.startsWith('', 0)", function()
		{
			expect('123'.startsWith('', 0)).toEqual(true);
		})

		it("String.prototype.startsWith: '123'.startsWith('', -1)", function()
		{
			expect('123'.startsWith('', -1)).toEqual(true);
		})

		it("String.prototype.startsWith: '123'.startsWith('', 10)", function()
		{
			expect('123'.startsWith('', 10)).toEqual(true);
		})

		it("String.prototype.startsWith: ''.startsWith('', 0)", function()
		{
			expect(''.startsWith('', 0)).toEqual(true);
		})

		it("String.prototype.startsWith: !''.startsWith(null, 0)", function()
		{
			expect(!''.startsWith(null, 0)).toEqual(true);
		})

		it("String.prototype.startsWith: !''.startsWith(undefined, 0)", function()
		{
			expect(!''.startsWith(undefined, 0)).toEqual(true);
		})

		it("String.prototype.startsWith: !''.startsWith(0, 0)", function()
		{
			expect(!''.startsWith(0, 0)).toEqual(true);
		})

		it("String.prototype.startsWith: !''.startsWith(0, -1)", function()
		{
			expect(!''.startsWith(0, -1)).toEqual(true);
		})

		it("String.prototype.startsWith: '-1'.startsWith(-1, -1)", function()
		{
			expect('-1'.startsWith(-1, -1)).toEqual(true);
		})

		it("String.prototype.startsWith: '[object Object]'.startsWith({})", function()
		{
			expect('[object Object]'.startsWith({})).toEqual(true);
		})

		it("String.prototype.startsWith: '[object Object]'.startsWith({})", function()
		{
			expect('[object Object]'.startsWith({})).toEqual(true);
		})
    });
	
	
    describe("endsWith", function() {
        it("String.prototype.endsWith: 'test'.endsWith('t')", function()
		{
			expect('test'.endsWith('t')).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test me'.endsWith('e')", function()
		{
			expect('test me'.endsWith('e')).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test me'.endsWith('me')", function()
		{
			expect('test me'.endsWith('me')).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test me'.endsWith('test me')", function()
		{
			expect('test me'.endsWith('test me')).toEqual(true);;
		})

		it("String.prototype.endsWith: !'test'.endsWith('TEST')", function()
		{
			expect(!'test'.endsWith('TEST')).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test me'.endsWith(' me')", function()
		{
			expect('test me'.endsWith(' me')).toEqual(true);;
		})

		it("String.prototype.endsWith: !'test me'.endsWith('t')", function()
		{
			expect(!'test me'.endsWith('t')).toEqual(true);;
		})

		it("String.prototype.endsWith: !''.endsWith('a')", function()
		{
			expect(!''.endsWith('a')).toEqual(true);;
		})

		it("String.prototype.endsWith: ''.endsWith('')", function()
		{
			expect(''.endsWith('')).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test me me'.endsWith('me')", function()
		{
			expect('test me me'.endsWith('me')).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test me me'.endsWith(' me')", function()
		{
			expect('test me me'.endsWith(' me')).toEqual(true);;
		})

		it("String.prototype.endsWith: !'m'.endsWith('me')", function()
		{
			expect(!'m'.endsWith('me')).toEqual(true);;
		})

		it("String.prototype.endsWith: !'me'.endsWith('me ')", function()
		{
			expect(!'me'.endsWith('me ')).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test me'.endsWith('me', 2)", function()
		{
			expect(!'test me'.endsWith('me', 2)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'test me'.endsWith('me', '2')", function()
		{
			expect(!'test me'.endsWith('me', '2')).toEqual(true);;
		})

		it("String.prototype.endsWith: !'test'.endsWith('test', 4)", function()
		{
			expect('test'.endsWith('test', 4)).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test'.endsWith('t', 1)", function()
		{
			expect('test'.endsWith('t', 1)).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test'.endsWith('e', 2)", function()
		{
			expect('test'.endsWith('e', 2)).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test'.endsWith('es', 3)", function()
		{
			expect('test'.endsWith('es', 3)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'test'.endsWith('tes', 4)", function()
		{
			expect(!'test'.endsWith('tes', 4)).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test'.endsWith('tes', 4)", function()
		{
			expect('test'.endsWith('tes', 3)).toEqual(true);;
		})

		it("String.prototype.endsWith: 'test'.endsWith('t', 4)", function()
		{
			expect('test'.endsWith('t', 4)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'a'.endsWith('a', 0)", function()
		{
		expect(!'a'.endsWith('a', 0)).toEqual(true);
		})

			it("String.prototype.endsWith: 'a'.startsWith('a', 1)", function()
		{
		expect('a'.endsWith('a', 1)).toEqual(true);
		})

		it("String.prototype.endsWith: !'test me'.endsWith('me', 0)", function()
		{
		expect(!'test me'.endsWith('me', 0)).toEqual(true);
		})

		it("String.prototype.endsWith: '123'.endsWith('3')", function()
		{
			expect('123'.endsWith('3')).toEqual(true);;
		})

		it("String.prototype.endsWith: '123'.endsWith('3')", function()
		{
			expect('123'.endsWith(3)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('3', 0)", function()
		{
			expect(!'123'.endsWith('3', 0)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('3', 0)", function()
		{
			expect(!'123'.endsWith(3, 0)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('3', 1)", function()
		{
			expect(!'123'.endsWith('3', 1)).toEqual(true);;
		})

			it("String.prototype.endsWith: !'123'.endsWith('3', 1)", function()
		{
			expect(!'123'.endsWith(3, 1)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('3', 2)", function()
		{
			expect(!'123'.endsWith('3', 2)).toEqual(true);;
		})

			it("String.prototype.endsWith: !'123'.endsWith('3', 2)", function()
		{
			expect(!'123'.endsWith(3, 2)).toEqual(true);;
		})

		it("String.prototype.endsWith: '123'.endsWith('3', 3)", function()
		{
			expect('123'.endsWith('3', 3)).toEqual(true);;
		})

		it("String.prototype.endsWith: '123'.endsWith('3', 3)", function()
		{
			expect('123'.endsWith(3, 3)).toEqual(true);;
		})

		it("String.prototype.endsWith: '123'.endsWith('3', 4)", function()
		{
			expect('123'.endsWith('3', 4)).toEqual(true);;
		})

			it("String.prototype.endsWith: '123'.endsWith('3', 4)", function()
		{
			expect('123'.endsWith(3, 4)).toEqual(true);;
		})

		it("String.prototype.endsWith: '123'.endsWith('1', '1')", function()
		{
			expect('123'.endsWith('1', 1)).toEqual(true);;
		})

		it("String.prototype.endsWith: '123'.endsWith('1', '1')", function()
		{
			expect('123'.endsWith(1, 1)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('1', null)", function()
		{
			expect(!'123'.endsWith('1', null)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('1', null)", function()
		{
			expect(!'123'.endsWith(1, null)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('3', null)", function()
		{
			expect(!'123'.endsWith('3', null)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('3', null)", function()
		{
			expect(!'123'.endsWith(3, null)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('1', -1)", function()
		{
			expect(!'123'.endsWith('1', -1)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('1', -1)", function()
		{
			expect(!'123'.endsWith(1, -1)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('3', -1)", function()
		{
			expect(!'123'.endsWith('3', -1)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('3', -1)", function()
		{
			expect(!'123'.endsWith(3, -1)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('3', -3)", function()
		{
			expect(!'123'.endsWith('3', -3)).toEqual(true);;
		})

		it("String.prototype.endsWith: !'123'.endsWith('3', -3)", function()
		{
			expect(!'123'.endsWith(3, -3)).toEqual(true);;
		})

		it("String.prototype.endsWith: '123'.endsWith('')", function()
		{
			expect('123'.endsWith('')).toEqual(true);;
		})

			it("String.prototype.endsWith: '123'.endsWith('', 0)", function()
		{
			expect('123'.endsWith('', 0)).toEqual(true);;
		})

		it("String.prototype.endsWith: '123'.endsWith('', -1)", function()
		{
			expect('123'.endsWith('', -1)).toEqual(true);;
		})

		it("String.prototype.endsWith: '123'.endsWith('', 10)", function()
		{
			expect('123'.endsWith('', 10)).toEqual(true);;
		})

		it("String.prototype.endsWith: ''.endsWith('', 0)", function()
		{
			expect(''.endsWith('', 0)).toEqual(true);;
		})

		it("String.prototype.endsWith: !''.endsWith(null, 0)", function()
		{
			expect(!''.endsWith(null, 0)).toEqual(true);;
		})

		it("String.prototype.endsWith: !''.endsWith(undefined, 0)", function()
		{
			expect(!''.endsWith(undefined, 0)).toEqual(true);;
		})

		it("String.prototype.endsWith: !''.endsWith(0, 0)", function()
		{
			expect(!''.endsWith(0, 0)).toEqual(true);;
		})

		it("String.prototype.endsWith: !''.endsWith(0, -1)", function()
		{
			expect(!''.endsWith(0, -1)).toEqual(true);;
		})

		it("String.prototype.endsWith: '-1'.endsWith(-1)", function()
		{
			expect('-1'.endsWith(-1)).toEqual(true);;
		})

		it("String.prototype.endsWith: '[object Object]'.endsWith({})", function()
		{
			expect('[object Object]'.endsWith({})).toEqual(true);;
		})

		it("String.prototype.endsWith: '[object Array]'.endsWith([])", function()
		{
			expect('[object Object]'.endsWith([])).toEqual(true);;
		})

    });
	
	
    describe("contains", function() {
        it("'Hello'.contains('He') is true", function() {
            expect('Hello'.contains('He')).toEqual(true);
        });
		it("'Hello Hello'.contains('Hello', 5) is true", function() {
            expect('Hello Hello'.contains('Hello', 5)).toEqual(true);
        });
    });
	
	
    /*describe("toArray", function() {
        it("'type of Hello'.toArray() is [object Array]", function() {
            expect(Object.prototype.toString.call('Hello'.toArray())).toEqual('[object Array]');
        });
    });*/
	
	
    /*describe("___TMPL___", function() {
        it("___TMPL___", function() {
            expect(___TMPL___).toEqual(___TMPL___);
        });
    });*/
});
