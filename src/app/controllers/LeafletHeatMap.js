angular.module('app')
  .controller("LeafletHeatMap", ['$scope', '$rootScope', '$http','factorysingletrack',function($scope, $rootScope, $http, factorysingletrack) {
      $scope.onload_heat_map = false;

      var points = [];
      var heatmap = {
        name: 'Heat Map',
        type: 'heat',
        data: points,
        visible: true
      };
      var mid_point = [0, 0];

      var dataset = [];
      var dataset_start = [];
      var dataset_end = [];

      factorysingletrack.get("https://envirocar.org/ng-user-stats.json").then(
        function(
          data) {
            // Currently this endpoint does not work! So for the moment we have created a JSON object that
            // is expected to be returned by the server in the near future at this endpoint.
          var datamap = [{
            "id": "5743fd9ee4b09078f971f0d7",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.935220557150537,
                  51.38094428409963
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  7.022849717547225,
                  51.43455885936926
                ]
              }
            }
          }, {
            "id": "4743fd9ee4b09078f971f0d8",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  13.154406,
                  53.437805
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  13.32280,
                  53.4959299
                ]
              }
            }
          }, {
            "id": "3743fd9ee4b09078f971f0d8",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  23.154406,
                  43.437805
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  23.32280,
                  43.4959299
                ]
              }
            }
          }, {
            "id": "5776646ae4b0ea2464218442",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.404467358656342,
                  51.18402870429451
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.404994199946344,
                  51.18590591284348
                ]
              }
            }
          }, {
            "id": "57765114e4b0ea2464214e96",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  7.641653513517912,
                  51.956889236456284
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  7.6477345356974045,
                  51.95404470543948
                ]
              }
            }
          }, {
            "id": "5776513de4b0ea2464214f1a",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  7.644580375786573,
                  51.95460329091727
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  7.6412895835009795,
                  51.956036665113196
                ]
              }
            }
          }, {
            "id": "57764b65e4b0ea246421494a",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.427190755898763,
                  51.20035713936406
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4369039520241715,
                  51.19951241601204
                ]
              }
            }
          }, {
            "id": "57764b62e4b0ea2464214848",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.443737426641247,
                  51.199998838200884
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.44773457388116,
                  51.201610174761306
                ]
              }
            }
          }, {
            "id": "57764b63e4b0ea246421487c",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.44563430943914,
                  51.20260973045408
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4410457990889425,
                  51.20414591608706
                ]
              }
            }
          }, {
            "id": "57764b64e4b0ea24642148ad",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.43929006194608,
                  51.19582188129439
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.427064527094577,
                  51.20084237852869
                ]
              }
            }
          }, {
            "id": "5776518fe4b0ea2464214f3e",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  7.632133599848622,
                  51.95599261825207
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  7.6485514011562215,
                  51.955012116904655
                ]
              }
            }
          }, {
            "id": "57764b61e4b0ea24642147db",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.45486727934904,
                  51.20998686022393
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.440926882288661,
                  51.203321502694486
                ]
              }
            }
          }, {
            "id": "577647e0e4b0ea2464214047",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.443865342879771,
                  51.185014762188246
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.446904646006544,
                  51.16931538549046
                ]
              }
            }
          }, {
            "id": "57764b60e4b0ea2464214717",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.439810550833277,
                  51.20136557982892
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.456300587013309,
                  51.21496764387763
                ]
              }
            }
          }, {
            "id": "57763e39e4b0ea2464211a05",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.412197571715114,
                  51.195367234564465
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.409762833517873,
                  51.19807611831955
                ]
              }
            }
          }, {
            "id": "577647e2e4b0ea24642140ea",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.440396944379694,
                  51.18504038143365
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.390027480169449,
                  51.19254517652837
                ]
              }
            }
          }, {
            "id": "57762a36e4b0ea24642030ac",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.409511547281797,
                  51.19786618976425
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4120479639500525,
                  51.19795008046114
                ]
              }
            }
          }, {
            "id": "57765472e4b0ea24642152db",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.456092810259012,
                  51.18468218811857
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.402350481603779,
                  51.2014438862616
                ]
              }
            }
          }, {
            "id": "5776546ce4b0ea2464215109",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.404186492878825,
                  51.20309410689679
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.456351780733914,
                  51.18484844129571
                ]
              }
            }
          }, {
            "id": "57764b66e4b0ea24642149a8",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.43255700112168,
                  51.19886228955912
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.428119723185099,
                  51.17757398705777
                ]
              }
            }
          }, {
            "id": "57764b5ae4b0ea2464214319",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.419246778980549,
                  51.215740652264934
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.3689590096596,
                  51.158544927457314
                ]
              }
            }
          }, {
            "id": "57766521e4b0ea24642187b5",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.441005582085575,
                  51.12363649923138
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.442626609241849,
                  51.16672815355285
                ]
              }
            }
          }, {
            "id": "5775854ce4b0ea24641da5a9",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.417558941003384,
                  51.14382199808161
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.413271353042924,
                  51.094747919870606
                ]
              }
            }
          }, {
            "id": "57764b5ee4b0ea246421453c",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.373425555120594,
                  51.16118965462855
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.443653232613194,
                  51.20001341819564
                ]
              }
            }
          }, {
            "id": "57762a36e4b0ea24642030d4",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4202348470532895,
                  51.194697475032775
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.45868993021597,
                  51.1951390723582
                ]
              }
            }
          }, {
            "id": "57764b57e4b0ea2464214210",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.438703968759348,
                  51.1991327032544
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.413686140623232,
                  51.213617243032076
                ]
              }
            }
          }, {
            "id": "57763e37e4b0ea2464211923",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.458745607337564,
                  51.19533627597726
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.419121175084944,
                  51.19475690825986
                ]
              }
            }
          }, {
            "id": "57764760e4b0ea2464213ccb",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.39120494682648,
                  51.17504964428816
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4089448179814115,
                  51.18163933489207
                ]
              }
            }
          }, {
            "id": "57766523e4b0ea24642189b4",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.44165383902738,
                  51.16656083105762
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.439141153299213,
                  51.12297296132521
                ]
              }
            }
          }, {
            "id": "57764754e4b0ea24642139b8",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.420027498621065,
                  51.176500651076985
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.3897588826268095,
                  51.175738106186515
                ]
              }
            }
          }, {
            "id": "577580f2e4b0ea24641da3d9",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.446925288890427,
                  51.16754034146805
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.398557335065439,
                  51.12570940504561
                ]
              }
            }
          }, {
            "id": "577645b6e4b0ea246421369e",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.420027498621065,
                  51.176500651076985
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.3897588826268095,
                  51.175738106186515
                ]
              }
            }
          }, {
            "id": "5775854fe4b0ea24641da64f",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.41588704348048,
                  51.100945256103174
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.422399327477971,
                  51.15753544594532
                ]
              }
            }
          }, {
            "id": "577650e3e4b0ea2464214d16",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  7.602228816418063,
                  51.96903492848623
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  7.647665370140864,
                  51.9551397791675
                ]
              }
            }
          }, {
            "id": "577647dde4b0ea2464213e96",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.390124305341978,
                  51.19257605575694
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.44409581391083,
                  51.1853207866315
                ]
              }
            }
          }, {
            "id": "5775f11be4b0ea24641fda23",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.211513451950248,
                  51.14426000463695
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.348597743272769,
                  51.201264572251986
                ]
              }
            }
          }, {
            "id": "57756156e4b0ea246419b3ad",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.425876369741509,
                  51.19850915604567
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4463635317110075,
                  51.22405820860787
                ]
              }
            }
          }, {
            "id": "5775806fe4b0ea24641da1d2",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.443179119938943,
                  51.1685594601409
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.3754798036878935,
                  51.16290675034104
                ]
              }
            }
          }, {
            "id": "57756157e4b0ea246419b52f",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.425869158670476,
                  51.198572576756746
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.445384582653745,
                  51.221667626462576
                ]
              }
            }
          }, {
            "id": "57760f1be4b0ea24641fe96f",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.386826574433698,
                  51.19814143265563
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.612717523792998,
                  51.28093183464423
                ]
              }
            }
          }, {
            "id": "57756159e4b0ea246419b7cb",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.415099626209443,
                  51.20055772702341
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.444839689876966,
                  51.22169285547183
                ]
              }
            }
          }, {
            "id": "57756156e4b0ea246419b49b",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4341380683832,
                  51.211107281602864
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.424736693755456,
                  51.198114303993705
                ]
              }
            }
          }, {
            "id": "577666f3e4b0ea246422750d",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4278825070300964,
                  51.19804019929087
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.54211730029207,
                  51.10968042719116
                ]
              }
            }
          }, {
            "id": "57761583e4b0ea24641febc4",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.23123161778507,
                  50.85634716009756
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.241040271528663,
                  50.802995703819875
                ]
              }
            }
          }, {
            "id": "577615b0e4b0ea24641ff3ad",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.228170065051653,
                  50.79420747661774
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.424548509978474,
                  51.01630565939218
                ]
              }
            }
          }, {
            "id": "57756158e4b0ea246419b5ff",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4430293404384695,
                  51.22102344053987
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.388987051660804,
                  51.1766357146839
                ]
              }
            }
          }, {
            "id": "5775694de4b0ea246419bd39",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.424345891656163,
                  51.140910332043504
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.43334504212789,
                  51.19559824185155
                ]
              }
            }
          }, {
            "id": "577558b7e4b0ea246419a4b9",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.402815635450066,
                  51.18395288527392
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.403611136772709,
                  51.18443495859965
                ]
              }
            }
          }, {
            "id": "57762610e4b0ea24642016f3",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.447442248181672,
                  51.172312210909865
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.450634671651676,
                  51.19478171258259
                ]
              }
            }
          }, {
            "id": "577558bae4b0ea246419a4d2",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.403548603400469,
                  51.18446386255167
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.402986197947947,
                  51.184603619786174
                ]
              }
            }
          }, {
            "id": "5775f116e4b0ea24641fd5a8",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.480720372216372,
                  51.20158347700896
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.211409357532932,
                  51.14287870210212
                ]
              }
            }
          }, {
            "id": "57756949e4b0ea246419b87b",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.430783627901177,
                  51.1959699626695
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.3887301567834385,
                  51.1494178508743
                ]
              }
            }
          }, {
            "id": "5775694fe4b0ea246419bede",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.439650147104313,
                  51.19591265247778
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.536297320899561,
                  51.26801688948248
                ]
              }
            }
          }, {
            "id": "577558c1e4b0ea246419a77d",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.454055987279665,
                  51.159728080568605
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.453654311053313,
                  51.16038358948236
                ]
              }
            }
          }, {
            "id": "5775f11de4b0ea24641fdc7c",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.348287742363263,
                  51.20128373310953
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.479093516522896,
                  51.20080743949056
                ]
              }
            }
          }, {
            "id": "577615a9e4b0ea24641ff0d7",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.457157173286543,
                  51.03890419162651
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.429525394100404,
                  51.193132790874465
                ]
              }
            }
          }, {
            "id": "577558ade4b0ea246419a20e",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.45092104807674,
                  51.1677034140092
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.447683956429245,
                  51.14742122498984
                ]
              }
            }
          }, {
            "id": "5775f06de4b0ea24641fd2e6",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.480911848880332,
                  51.27318961891811
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.36553807926018,
                  51.153772723446295
                ]
              }
            }
          }, {
            "id": "577666f0e4b0ea2464227191",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.542169407017739,
                  51.10975037196807
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.427843598341901,
                  51.198046449795534
                ]
              }
            }
          }, {
            "id": "577558eae4b0ea246419ac56",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.465314378084453,
                  51.212383720046276
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.463332848366965,
                  51.213847130531185
                ]
              }
            }
          }, {
            "id": "57754019e4b0ea24641928a6",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.38303135144122,
                  51.20078389931177
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.397179261472343,
                  51.19793439148825
                ]
              }
            }
          }, {
            "id": "577558a3e4b0ea246419a180",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.441144609910536,
                  51.16833202217391
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.439740485453308,
                  51.17484606761607
                ]
              }
            }
          }, {
            "id": "577605bfe4b0ea24641fe6f7",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.418390786873346,
                  51.153515684771904
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.447801282779045,
                  51.19497312747178
                ]
              }
            }
          }, {
            "id": "577558b4e4b0ea246419a2f3",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.447962026577092,
                  51.14733729682779
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4039665702115105,
                  51.18408904726774
                ]
              }
            }
          }, {
            "id": "5775524fe4b0ea24641992c1",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.451022772674847,
                  51.15859102708801
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.441588399328962,
                  51.143108211959465
                ]
              }
            }
          }, {
            "id": "57756154e4b0ea246419b006",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.448384837039912,
                  51.224134999550955
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.389599432865177,
                  51.17656366190115
                ]
              }
            }
          }, {
            "id": "57754c5ae4b0ea24641938cd",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.42149733,
                  51.18750078
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.436325599881156,
                  51.199319557684305
                ]
              }
            }
          }, {
            "id": "577558e8e4b0ea246419aa84",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4359819098197075,
                  51.1950955118657
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.464927634705559,
                  51.212097445617935
                ]
              }
            }
          }, {
            "id": "577558eee4b0ea246419aca5",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.464175277924784,
                  51.213494675426446
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.442484572218469,
                  51.22487129762233
                ]
              }
            }
          }, {
            "id": "57753ffde4b0ea2464191c42",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.42510251486487,
                  51.191731708153014
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.402513363011447,
                  51.201583637600464
                ]
              }
            }
          }, {
            "id": "57766468e4b0ea2464217f8b",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.3633384775742305,
                  51.15125428529916
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4044957049191,
                  51.1840085266158
                ]
              }
            }
          }, {
            "id": "57756952e4b0ea246419c11f",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.386012875417266,
                  51.14446169469532
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.442021265189815,
                  51.19103553280199
                ]
              }
            }
          }, {
            "id": "577603c4e4b0ea24641fdec8",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.441762592592097,
                  51.14308015160661
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.509039142449997,
                  51.27173713095
                ]
              }
            }
          }, {
            "id": "57756155e4b0ea246419b298",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.390550890415572,
                  51.176085183341414
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.420206923286264,
                  51.19458501857206
                ]
              }
            }
          }, {
            "id": "57754017e4b0ea246419250e",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.448140260343947,
                  51.18473239531964
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.386759135726731,
                  51.20212836168953
                ]
              }
            }
          }, {
            "id": "57755556e4b0ea246419998f",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.429611104814467,
                  51.19806301976002
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.384140513070005,
                  51.17566881140999
                ]
              }
            }
          }, {
            "id": "57762d08e4b0ea246420e19f",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.3412654717962695,
                  51.20868552910721
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.43537518,
                  51.20820034
                ]
              }
            }
          }, {
            "id": "57754019e4b0ea2464192698",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.473873813654386,
                  51.20036373756599
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.431838310238083,
                  51.176731875955596
                ]
              }
            }
          }, {
            "id": "57754122e4b0ea2464192933",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.390358370638606,
                  51.194409751587955
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.414737201466832,
                  51.1835896322786
                ]
              }
            }
          }, {
            "id": "5775694be4b0ea246419ba41",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.386991693487049,
                  51.14241409484467
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.419177038072087,
                  51.13664153268
                ]
              }
            }
          }, {
            "id": "5775589fe4b0ea2464199eeb",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.442503246300685,
                  51.22525056371982
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.450206812505572,
                  51.168349733727766
                ]
              }
            }
          }, {
            "id": "577558cae4b0ea246419a7c9",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.453868235205829,
                  51.160117537121735
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.438275011961704,
                  51.19580787243987
                ]
              }
            }
          }, {
            "id": "577558bee4b0ea246419a51e",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.398688969493568,
                  51.18487700171065
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.450300648676292,
                  51.16834437922643
                ]
              }
            }
          }, {
            "id": "57755554e4b0ea2464199622",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.54240284,
                  51.10970271
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.429466164143436,
                  51.198072887579734
                ]
              }
            }
          }, {
            "id": "57754c60e4b0ea24641939c1",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4375773348916026,
                  51.20253001715635
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.786972407284545,
                  51.241541176748505
                ]
              }
            }
          }, {
            "id": "5776158be4b0ea24641fece1",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.421548815542783,
                  51.19711366277678
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.241994461052773,
                  50.879065299480594
                ]
              }
            }
          }, {
            "id": "57754cb8e4b0ea246419435f",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.452885559922661,
                  51.16614113396189
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.443758182767971,
                  51.20004629103491
                ]
              }
            }
          }, {
            "id": "5775524be4b0ea2464198f7e",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.507101711098747,
                  51.2730986957346
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.451800802863536,
                  51.16233315927008
                ]
              }
            }
          }, {
            "id": "57754c73e4b0ea2464193d2e",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.786901918269779,
                  51.24040952118132
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.452768293346492,
                  51.1656662463841
                ]
              }
            }
          }, {
            "id": "57762c16e4b0ea2464206d8b",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.341161336995731,
                  51.208415988228296
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.441853323681045,
                  51.16888390040913
                ]
              }
            }
          }, {
            "id": "57762cd3e4b0ea246420dd7b",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.438977654222656,
                  51.16867544961613
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.34207791,
                  51.20551356
                ]
              }
            }
          }, {
            "id": "57754014e4b0ea2464191d2d",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  7.107602489267209,
                  51.5026794472295
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.45557201270198,
                  51.18452750196255
                ]
              }
            }
          }, {
            "id": "577625a3e4b0ea2464200ae7",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.341079055648873,
                  51.2066879919256
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.44190291834726,
                  51.168908501437144
                ]
              }
            }
          }, {
            "id": "57762bbee4b0ea2464205e55",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.341186284132805,
                  51.2085027435569
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.44138736,
                  51.16827359999999
                ]
              }
            }
          }, {
            "id": "57762c58e4b0ea24642079a2",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.42331434,
                  51.20978667
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.399148392872492,
                  51.19507302056138
                ]
              }
            }
          }, {
            "id": "57762a41e4b0ea24642031e0",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.441856331651936,
                  51.16890650564406
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.341219753487611,
                  51.207880731394
                ]
              }
            }
          }, {
            "id": "57762b1ce4b0ea246420423e",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.341273290637881,
                  51.20899849531894
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4359888,
                  51.16962793
                ]
              }
            }
          }, {
            "id": "57762c9de4b0ea24642088de",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.423861360891669,
                  51.20808345388015
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.399175784540195,
                  51.194994314991675
                ]
              }
            }
          }, {
            "id": "57762b6de4b0ea2464204ff1",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.441921792645587,
                  51.168882615788775
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.341322724171256,
                  51.20897257836511
                ]
              }
            }
          }, {
            "id": "57762893e4b0ea2464201aea",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.399198250558042,
                  51.19498226190518
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.423321264860075,
                  51.20976217535752
                ]
              }
            }
          }, {
            "id": "57765c72e4b0ea246421551f",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.493878360000454,
                  51.2218940729999
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.49122276,
                  51.22202375
                ]
              }
            }
          }, {
            "id": "57762ca1e4b0ea2464208edd",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.3412258318562955,
                  51.208212960839745
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.408892027427136,
                  51.15593728
                ]
              }
            }
          }, {
            "id": "57754f30e4b0ea2464194633",
            "startPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.4940111370612925,
                  51.22162397734701
                ]
              }
            },
            "endPosition": {
              "geometry": {
                "type": "Point",
                "coordinates": [
                  6.487146508153163,
                  51.23435469663926
                ]
              }
            }
          }]

          for (var i = 0; i < datamap.length; i++) {
            var coord_push_start = [];
            var coord_push_end = [];
            // To store start points longitude and latitude
            coord_push_start[1] = datamap[i]['startPosition']['geometry']['coordinates'][0];
            coord_push_start[0] = datamap[i]['startPosition']['geometry']['coordinates'][1];
            coord_push_start[2] = 1;

            mid_point[0] += coord_push_start[1];
            mid_point[1] += coord_push_start[0];

            // To store end points longitude and latitude
            coord_push_end[1] = datamap[i]['endPosition']['geometry']['coordinates'][0];
            coord_push_end[0] = datamap[i]['endPosition']['geometry']['coordinates'][1];
            coord_push_end[2] = 1;

            // Used to calculate center of map.
            mid_point[0] += coord_push_end[1];
            mid_point[1] += coord_push_end[0];

            dataset_start.push(coord_push_start);
            dataset_end.push(coord_push_end);
            dataset.push(coord_push_start);
            dataset.push(coord_push_end);
          }
          // Calculating mid point of all coordinates
          mid_point[0] = mid_point[0] / (datamap.length * 2);
          mid_point[1] = mid_point[1] / (datamap.length * 2);

          $scope.center = {
            lat: mid_point[1],
            lng: mid_point[0],
            zoom: 6
          }

          $scope.layers.overlays = {
            heat: {
              name: 'Heat Map',
              type: 'heat',
              data: dataset,
              layerOptions: {
                radius: 20,
                blur: 30,
                minopacity: 0,
                maxZoom: 8
              },
              visible: true
            }
          };

          $scope.onload_heat_map = true;
        });

      // Check the mapbox documentation for adding the mapid and apikey.
      // Please replace this in the future with a mapbox account of enviroCar.
      
      angular.extend($scope, {
        center: {},
        layers: {
          baselayers: {
            mapbox_light: {
              name: 'Mapbox Light',
              url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
              type: 'xyz',
              layerOptions: {
                apikey: 'pk.eyJ1IjoibmF2ZWVuamFmZXIiLCJhIjoiY2lsYnVmamE0MDA1MXdnbHpvNGZianRuOCJ9.5KqDlJGBKr7ZF9Rdg6j_yQ',
                mapid: 'naveenjafer.0n3ooo76'
              }
            },

            osm: {
              name: 'OpenStreetMap',
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              type: 'xyz'
            }


          }

        }
      });

    }
  ]);
