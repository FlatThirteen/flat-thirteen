var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
describe('App', function () {
    beforeEach(function () {
        return yield browser.get('/');
    });
    it('should have a title', function () {
        expect(browser.getTitle()).toEqual('Flat Thirteen, Inc.');
    });
    it('should have <nav>', function () {
        expect(element(by.css('sd-app sd-navbar nav')).isPresent()).toEqual(true);
    });
    it('should have correct nav text for Home', function () {
        expect(element(by.css('sd-app sd-navbar nav a:first-child')).getText()).toEqual('HOME');
    });
    it('should have correct nav text for About', function () {
        expect(element(by.css('sd-app sd-navbar nav a:nth-child(2)')).getText()).toEqual('ABOUT');
    });
});
//# sourceMappingURL=app.component.e2e-spec.js.map
