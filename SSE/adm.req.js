class AdmReq {

    parse(req) {
        let urlstr = req.url.replace(/^\//, "http://");
        let url = new URL(urlstr);

        return url;
    }
}

module.exports = AdmReq;