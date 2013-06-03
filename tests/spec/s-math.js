describe('Math', function() {
    "use strict";
	
	
	// ES6
	
	/*
	 Math.log10
	*/
	describe("log10", function() {
        it('Math.log10: > 0', function()
		{
			expect(Math.ceil(Math.log10(10))).toBe(1);
		})

		it('Math.log10: < 0', function()
		{
			expect(Number.isNaN(Math.log10(-10))).toBe(true);
		})

		it('Math.log10: NaN', function()
		{
			expect(Number.isNaN(Math.log10(NaN))).toBe(true);
		})

		it('Math.log10: +0', function()
		{
			expect(Math.log10(0)).toEqual(-Infinity);
		})

		it('Math.log10: -0', function()
		{
			expect(Math.log10(-0)).toEqual(-Infinity);
		})

		it('Math.log10: 1', function()
		{
			expect(Math.log10(1)).toBe(0);
		})

		it('Math.log10: +Infinity', function()
		{
			expect(Math.log10(Infinity)).toEqual(Infinity);
		});

    });
	
	/*
	 Math.log2
	*/

	describe('Math.log2', function(){

		it('Math.log2: > 0', function()
		{
			expect(Math.ceil(Math.log2(10))).toBe(4)
		})

		it('Math.log2: < 0', function()
		{
			expect(Number.isNaN(Math.log2(-10))).toBe(true);
		})

		it('Math.log2: NaN', function()
		{
			expect(Number.isNaN(Math.log2(NaN))).toBe(true);
		})

		it('Math.log2: +0', function()
		{
			expect(Math.log2(0)).toEqual(-Infinity);
		})

		it('Math.log2: -0', function()
		{
			expect(Math.log2(-0)).toEqual(-Infinity);
		})

		it('Math.log2: 1', function()
		{
			expect(Math.log2(1)).toBe(0);
		})

		it('Math.log2: +Infinity', function()
		{
			expect(Math.log2(Infinity)).toEqual(Infinity);
		});
	});

	/*
	 Math.log1p
	*/
	describe('Math.log1p', function(){

		it('Math.log1p: > 0', function()
		{
			expect(Math.ceil(Math.log1p(10)), 3)
		})

		it('Math.log1p: < -1', function()
		{
			expect(Number.isNaN(Math.log1p(-10))).toBe(true);
		})

		it('Math.log1p: NaN', function()
		{
			expect(Number.isNaN(Math.log1p(NaN))).toBe(true);
		})

		it('Math.log1p: +0', function()
		{
			expect(Math.log1p(0)).toBe(-0);
		})

		it('Math.log1p: -0', function()
		{
			expect(Math.log1p(-0)).toBe(-0);
		})

		it('Math.log1p: +Infinity', function()
		{
			expect(Math.log1p(Infinity)).toEqual(Infinity)
		});

	});


	/*
	 Math.expm1
	*/
	describe('Math.expm1', function(){

		it('Math.expm1: NaN', function()
		{
			expect(Number.isNaN(Math.expm1(NaN))).toBe(true);
		})

		it('Math.expm1: +0', function()
		{
			expect(Math.expm1(0)).toBe(0)
		})

		it('Math.expm1: -0', function()
		{
			expect(Math.expm1(-0)).toBe(-0)
		})

		it('Math.expm1: +Infinity', function()
		{
			expect(Math.expm1(Infinity)).toBe(Infinity)
		})

		it('Math.expm1: -Infinity', function()
		{
			expect(Math.expm1(-Infinity)).toBe(-1)
		});

	});


	/*
	 Math.cosh
	*/
	describe('Math.cosh', function(){

		it('Math.cosh: NaN', function()
		{
			expect(Number.isNaN(Math.cosh(NaN))).toBe(true);
		})

		it('Math.cosh: +0', function()
		{
			expect(Math.expm1(0)).toBe(0)
		})

		it('Math.cosh: -0', function()
		{
			expect(Math.cosh(-0)).toBe(-0)
		})

		it('Math.cosh: +Infinity', function()
		{
			expect(Math.cosh(Infinity)).toBe(Infinity)
		})

		it('Math.cosh: -Infinity', function()
		{
			expect(Math.cosh(-Infinity)).toBe(-Infinity)
		});


		/*
		 Math.sinh
		*/

		});
	describe('Math.sinh', function(){

		it('Math.sinh: NaN', function()
		{
			expect(Number.isNaN(Math.sinh(NaN))).toBe(true);
		})

		it('Math.sinh: +0', function()
		{
			expect(Math.sinh(0)).toBe(0)
		})

		it('Math.sinh: -0', function()
		{
			expect(Math.sinh(-0)).toBe(-0)
		})

		it('Math.sinh: +Infinity', function()
		{
			expect(Math.sinh(Infinity)).toBe(Infinity)
		})

		it('Math.sinh: -Infinity', function()
		{
			expect(Math.sinh(-Infinity)).toBe(-Infinity)
		});

	});


	/*
	 Math.tanh
	*/
	describe('Math.tanh', function(){

		it('Math.tanh: NaN', function()
		{
			expect(Number.isNaN(Math.tanh(NaN))).toBe(true);
		})

		it('Math.tanh: +0', function()
		{
			expect(Math.tanh(0)).toBe(0)
		})

		it('Math.tanh: -0', function()
		{
			expect(Math.tanh(-0)).toBe(-0)
		})

		it('Math.tanh: +Infinity', function()
		{
			expect(Math.tanh(+Infinity)).toBe(1)
		})

		it('Math.tanh: -Infinity', function()
		{
			expect(Math.tanh(-Infinity)).toBe(-1)
		})

		it('Math.tanh: > 0', function()
		{
			expect(Math.ceil(Math.tanh(10))).toBe(1)
		})

		it('Math.tanh: < 0', function()
		{
			expect(Math.ceil(Math.tanh(-10))).toBe(0)
		});

	});


	/*
	 Math.acosh
	*/
	describe('Math.acosh', function(){

		it('Math.acosh: NaN', function()
		{
			expect(Number.isNaN(Math.acosh(NaN))).toBe(true);
		})

		it('Math.acosh: < 1', function()
		{
			expect(Number.isNaN(Math.acosh(0))).toBe(true);
		})

		it('Math.tanh: 1', function()
		{
			expect(Math.acosh(1)).toBe(+0)
		})

		it('Math.acosh: +Infinity', function()
		{
			expect(Math.acosh(+Infinity)).toBe(+Infinity)
		})

		it('Math.acosh: > 0', function()
		{
			expect(Math.ceil(Math.acosh(10))).toBe(3)
		});

	});


	/*
	 Math.asinh
	*/
	describe('Math.asinh', function(){

		it('Math.asinh: NaN', function()
		{
			expect(Number.isNaN(Math.asinh(NaN))).toBe(true);
		})

		it('Math.asinh: +0', function()
		{
			expect(Math.asinh(0)).toBe(0)
		})

		it('Math.asinh: -0', function()
		{
			expect(Math.asinh(-0)).toBe(-0)
		})

		it('Math.asinh: +Infinity', function()
		{
			expect(Math.asinh(+Infinity)).toBe(+Infinity)
		})

		it('Math.asinh: -Infinity', function()
		{
			expect(Math.asinh(-Infinity)).toBe(-Infinity)
		})

		it('Math.asinh: > 0', function()
		{
			expect(Math.ceil(Math.asinh(10))).toBe(3)
		})

		it('Math.asinh: < 0', function()
		{
			expect(Math.ceil(Math.asinh(-10))).toBe(-2)
		});

	});


	/*
	 Math.atanh
	*/
	describe('Math.atanh', function(){

		it('Math.atanh: NaN', function()
		{
			expect(Number.isNaN(Math.atanh(NaN))).toBe(true);
		})

		it('Math.atanh: < -1', function()
		{
			expect(Number.isNaN(Math.atanh(-10))).toBe(true);
		})

		it('Math.atanh: > 1', function()
		{
			expect(Number.isNaN(Math.atanh(10))).toBe(true);
		})

		it('Math.atanh: -1', function()
		{
			expect(Math.atanh(-1)).toBe(-Infinity)
		})

		it('Math.atanh: +1', function()
		{
			expect(Math.atanh(+1)).toBe(+Infinity)
		})

		it('Math.atanh: +0', function()
		{
			expect(Math.atanh(0)).toBe(0)
		})

		it('Math.atanh: -0', function()
		{
			expect(Math.atanh(-0)).toBe(-0)
		});

	});


	/*
	 Math.hypot
	*/
	describe('Math.hypot', function(){

		it('Math.hypot: +Infinity', function()
		{
			expect(Math.hypot(+Infinity, 1)).toBe(+Infinity)
		})

		it('Math.hypot: -Infinity', function()
		{
			expect(Math.hypot(-Infinity, 1)).toBe(-Infinity)
		})

		it('Math.hypot: NaN', function()
		{
			expect(Number.isNaN(Math.hypot(NaN, 1))).toBe(true);
		})

		it('Math.hypot: +0', function()
		{
			expect(Math.hypot(0, 0)).toBe(0)
		})

		it('Math.hypot: -0', function()
		{
			expect(Math.hypot(-0, -0)).toBe(0)
		});

	});


	/*
	 Math.trunc
	*/
	describe('Math.trunc', function(){

		it('Math.trunc: NaN', function()
		{
			expect(Number.isNaN(Math.trunc(NaN))).toBe(true);
		})

		it('Math.trunc: +0', function()
		{
			expect(Math.trunc(+0)).toBe(+0)
		})

		it('Math.trunc: -0', function()
		{
			expect(Math.trunc(-0)).toBe(-0)
		})

		it('Math.trunc: +Infinity', function()
		{
			expect(Math.trunc(+Infinity)).toBe(+Infinity)
		})

		it('Math.trunc: -Infinity', function()
		{
			expect(Math.trunc(-Infinity)).toBe(-Infinity)
		})

		it('Math.trunc: float', function()
		{
			expect(Math.trunc(0.1)).toBe(0)
		});

	});


	/*
	 Math.trunc
	*/
	describe('Math.sign', function(){

		it('Math.sign: NaN', function()
		{
			expect(Number.isNaN(Math.sign(NaN))).toBe(true);
		})

		it('Math.sign: +0', function()
		{
			expect(Math.sign(+0)).toBe(+0)
		})

		it('Math.trunc: -0', function()
		{
			expect(Math.sign(-0)).toBe(-0)
		})

		it('Math.sign: +1', function()
		{
			expect(Math.sign(+1)).toBe(+1)
		})

		it('Math.sign: -1', function()
		{
			expect(Math.sign(-1)).toBe(-1)
		});

	});


	/*
	 Math.cbrt
	*/
	describe('Math.cbrt', function(){

		it('Math.cbrt: NaN', function()
		{
			expect(Number.isNaN(Math.cbrt(NaN))).toBe(true);
		})

		it('Math.cbrt: +0', function()
		{
			expect(Math.cbrt(+0)).toBe(+0)
		})

		it('Math.cbrt: -0', function()
		{
			expect(Math.cbrt(-0)).toBe(-0)
		})

		it('Math.cbrt: +Infinity', function()
		{
			expect(Math.cbrt(+Infinity)).toBe(+Infinity)
		})

		it('Math.cbrt: -Infinity', function()
		{
			expect(Math.cbrt(-Infinity)).toBe(-Infinity)
		});

	});


	/*
	 * Math.imul
	 * @see https://bugs.webkit.org/show_bug.cgi?id=115143
	 */
	describe('Math.imul', function(){

		it('Math.imul: Math.imul(1, 0.5)', function()
		{
			expect(Math.imul(1, 0.5)).toBe(0)
		})

		it('Math.imul: Math.imul(1, -0.5)', function()
		{
			expect(Math.imul(1, -0.5)).toBe(0)
		})

		it('Math.imul: Math.imul(2, 1 << 30)', function()
		{
			expect(Math.imul(2, 1 << 30)).toBe(-2147483648)
		})

		it('Math.imul: Math.imul(4, 1 << 30)', function()
		{
			expect(Math.imul(4, 1 << 30)).toBe(0)
		})

		it('Math.imul: Math.imul(1, NaN)', function()
		{
			expect(Math.imul(1, NaN)).toBe(0)
		})

		it('Math.imul: Math.imul(1, Infinity)', function()
		{
			expect(Math.imul(1, Infinity)).toBe(0)
		})

		it('Math.imul: Math.imul(0.5, 1)', function()
		{
			expect(Math.imul(0.5, 1)).toBe(0)
		})

		it('Math.imul: Math.imul(-0.5, 1)', function()
		{
			expect(Math.imul(-0.5, 1)).toBe(0)
		})

		it('Math.imul: Math.imul(1 << 30, 2)', function()
		{
			expect(Math.imul(1 << 30, 2)).toBe(-2147483648)
		})

		it('Math.imul: Math.imul(1 << 30, 4)', function()
		{
			expect(Math.imul(1 << 30, 4)).toBe(0)
		})

		it('Math.imul: Math.imul(NaN, 1)', function()
		{
			expect(Math.imul(NaN, 1)).toBe(0)
		})

		it('Math.imul: Math.imul(Infinity, 1)', function()
		{
			expect(Math.imul(Infinity, 1)).toBe(0)
		})

		it('Math.imul: Math.imul(NaN, NaN, 2)', function()
		{
			expect(Math.imul(NaN, NaN, 2)).toBe(0)
		})

		it('Math.imul: Math.imul(Infinity, Infinity, 2)', function()
		{
			expect(Math.imul(Infinity, Infinity, 2)).toBe(0)
		})

		it('Math.imul: Math.imul(Infinity, -Infinity)', function()
		{
			expect(Math.imul(Infinity, -Infinity)).toBe(0)
		})

		it('Math.imul: Math.imul(-Infinity, Infinity)', function()
		{
			expect(Math.imul(-Infinity, Infinity)).toBe(0)
		})

		it('Math.imul: Math.imul(-Infinity, -Infinity)', function()
		{
			expect(Math.imul(-Infinity, -Infinity)).toBe(0)
		})

		it('Math.imul: Math.imul(2, 2)', function()
		{
			expect(Math.imul(2, 2)).toBe(4)
		})

		it('Math.imul: Math.imul(2.5, 2)', function()
		{
			expect(Math.imul(2.5, 2)).toBe(4)
		})

		it('Math.imul: Math.imul(2.5, 2)', function()
		{
			expect(Math.imul(2.5, 2)).toBe(4)
		})

		it('Math.imul: Math.imul(2, 2.5)', function()
		{
			expect(Math.imul(2, 2.5)).toBe(4)
		})

		it('Math.imul: Math.imul(2.5, 2)', function()
		{
			expect(Math.imul(2.5, 2)).toBe(4);
		})

		it('Math.imul: Math.imul(2.5, 2.5)', function()
		{
			expect(Math.imul(2.5, 2.5)).toBe(4);
		})

		it('Math.imul: Math.imul(-2, -2)', function()
		{
			expect(Math.imul(-2, -2)).toBe(4);
		})

		it('Math.imul: Math.imul(-2.5, -2)', function()
		{
			expect(Math.imul(-2.5, -2)).toBe(4);
		})

		it('Math.imul: Math.imul(-2.5, -2)', function()
		{
			expect(Math.imul(-2.5, -2)).toBe(4);
		})

		it('Math.imul: Math.imul(-2, -2.5)', function()
		{
			expect(Math.imul(-2, -2.5)).toBe(4);
		})

		it('Math.imul: Math.imul(-2.5, -2)', function()
		{
			expect(Math.imul(-2.5, -2)).toBe(4);
		})

		it('Math.imul: Math.imul(-2.5, -2.5)', function()
		{
			expect(Math.imul(-2.5, -2.5)).toBe(4)
		})

		it('Math.imul: Math.imul(-2, 2)', function()
		{
			expect(Math.imul(-2, 2)).toBe(-4)
		})

		it('Math.imul: Math.imul(-2.5, 2)', function()
		{
			expect(Math.imul(-2.5, 2)).toBe(-4)
		})

		it('Math.imul: Math.imul(-2.5, 2)', function()
		{
			expect(Math.imul(-2.5, 2)).toBe(-4)
		})

		it('Math.imul: Math.imul(-2, 2.5)', function()
		{
			expect(Math.imul(-2, 2.5)).toBe(-4)
		})

		it('Math.imul: Math.imul(-2.5, 2)', function()
		{
			expect(Math.imul(-2.5, 2)).toBe(-4)
		})

		it('Math.imul: Math.imul(-2.5, 2.5)', function()
		{
			expect(Math.imul(-2.5, 2.5)).toBe(-4)
		})

		it('Math.imul: Math.imul(2, -2)', function()
		{
			expect(Math.imul(2, -2)).toBe(-4)
		})

		it('Math.imul: Math.imul(2.5, -2)', function()
		{
			expect(Math.imul(2.5, -2)).toBe(-4)
		})

		it('Math.imul: Math.imul(2.5, -2)', function()
		{
			expect(Math.imul(2.5, -2)).toBe(-4)
		})

		it('Math.imul: Math.imul(2, -2.5)', function()
		{
			expect(Math.imul(2, -2.5)).toBe(-4)
		})

		it('Math.imul: Math.imul(2.5, -2)', function()
		{
			expect(Math.imul(2.5, -2)).toBe(-4)
		})

		it('Math.imul: Math.imul(2.5, -2.5)', function()
		{
			expect(Math.imul(2.5, -2.5)).toBe(-4)
		})

		it('Math.imul: Math.imul(NaN, 1)', function()
		{
			expect(Math.imul(NaN, 1)).toBe(0)
		})

		it('Math.imul: Math.imul(Infinity, 1)', function()
		{
			expect(Math.imul(Infinity, 1)).toBe(0)
		})

		it('Math.imul: Math.imul(1e40, 1)', function()
		{
			expect(Math.imul(1e40, 1)).toBe(0)
		})

		it('Math.imul: Math.imul(0xffffffff, 5)', function()
		{
			expect(Math.imul(0xffffffff, 5)).toBe(-5)
		})

		it('Math.imul: Math.imul(0xfffffffe, 5)', function()
		{
			expect(Math.imul(0xfffffffe, 5)).toBe(-10)
		})

		it('Math.imul: Math.imul(1, NaN)', function()
		{
			expect(Math.imul(1, NaN)).toBe(0)
		})

		it('Math.imul: Math.imul(1, Infinity)', function()
		{
			expect(Math.imul(1, Infinity)).toBe(0)
		})

		it('Math.imul: Math.imul(1, 1e40)', function()
		{
			expect(Math.imul(1, 1e40)).toBe(0)
		})
	});
});