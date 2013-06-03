describe('Number', function() {
    "use strict";
	
	
	// ES6
	
    describe("Number.EPSILON", function() {
        expect(Number.EPSILON).toEqual(2.220446049250313e-16);
    });
	
	describe("Number.MAX_INTEGER", function() {
        expect(Number.MAX_INTEGER).toEqual(9007199254740991);
    });
	
	describe("Number.parseInt", function() {
        it("Number.parseInt('1000000000000000000000') is 1e+21", function() {
            expect(Number.parseInt('1000000000000000000000')).toEqual(1e+21);
        });
				
		it("32 radix: Number.parseInt((10).toString(32), 32) is 10", function()
		{
			expect(Number.parseInt((10).toString(32), 32)).toBe(10);
		})

		it('16 radix: Number.parseInt((10).toString(16), 16) is 10', function()
		{
			expect(Number.parseInt((10).toString(16), 16)).toBe(10);
		})

		it("10: Number.parseInt('10') is 10", function()
		{
			expect(Number.parseInt('10')).toBe(10);
		})

		it('8 radix: Number.parseInt((10).toString(8), 8) is 10', function()
		{
			expect(Number.parseInt((10).toString(8), 8)).toBe(10);
		})

		it('2 radix: Number.parseInt((10).toString(2) is 10', function()
		{
			expect(Number.parseInt((10).toString(2), 2)).toBe(10);
		})

		it("int: Number.parseInt('10px') is 10", function()
		{
			expect(Number.parseInt('10px')).toBe(10);
		})

		it("float: Number.parseInt(10.1) is 10", function()
		{
			expect(Number.parseInt(10.1)).toBe(10);
		})

		it("float: Number.parseInt('10.1') is 10", function()
		{
			expect(Number.parseInt('10.1')).toBe(10);
		})

		it('E+: Number.parseInt(0.100E+2) is 10', function()
		{
			expect(Number.parseInt(0.100E+2)).toBe(10);
		})

		it('E-: Number.parseInt(10.1) is 10', function()
		{
			expect(Number.parseInt(1000E-2)).toBe(10);
		})

		it("NaN: Number.parseInt('i10') is NaN", function()
		{
			expect(Number.isNaN(Number.parseInt('i10'))).toBe(true);
		})
    });
	
	describe("Number.parseFloat", function() {
		it("E+2*: Number.parseFloat('1000000000000000000000') is 1e+21", function()
		{
			expect(Number.parseFloat('1000000000000000000000')).toBe(1e+21);
		})

		it("10: Number.parseFloat('10') is 10", function()
		{
			expect(Number.parseFloat('10')).toBe(10);
		})

		it("int: Number.parseFloat('10px') is 10", function()
		{
			expect(Number.parseFloat('10px')).toBe(10);
		})

		it("float: Number.parseFloat('10.1em') is 10.1", function()
		{
			expect(Number.parseFloat('10.1em')).toBe(10.1);
		})

		it("E+: Number.parseFloat(0.100E+2) is 10", function()
		{
			expect(Number.parseFloat(0.100E+2)).toBe(10);
		})

		it('E-: Number.parseFloat(1000E-2)', function()
		{
			expect(Number.parseFloat(1000E-2)).toBe(10);
		});

		it("NaN: Number.parseFloat('f10') is NaN", function()
		{
			expect(Number.isNaN(Number.parseFloat('f10'))).toBe(true);
		})

	});
	
    /*describe("___TMPL___", function() {
        it("___TMPL___", function() {
            expect(___TMPL___).toEqual(___TMPL___);
        });
    });*/
});
